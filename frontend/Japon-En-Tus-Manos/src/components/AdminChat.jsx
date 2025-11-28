import React, { useEffect, useState, useRef } from "react";
import { getAllRooms, getMessages } from "../services/chatAdmin";
import { getSocket } from "../socket/socket";

function AdminChat() {
  const ADMIN_ID = 0;
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const socketRef = useRef(null);
  const joinedRooms = useRef(new Set());

  // 1️⃣ Inicializar socket
  useEffect(() => {
    socketRef.current = getSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.off("roomsUpdated");
        socketRef.current.off("newMessage");
      }
    };
  }, []);

  // 2️⃣ Cargar salas iniciales
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await getAllRooms();
        console.log("🏠 Salas desde API:", data);

        // Filtrar duplicados por UserID (no por RoomID)
        const uniqueRooms = data.reduce((acc, room) => {
          const exists = acc.find(r => r.UserID === room.UserID);
          if (!exists) {
            acc.push(room);
          }
          return acc;
        }, []);

        console.log("✅ Salas únicas después de filtrar:", uniqueRooms);
        setRooms(uniqueRooms);
      } catch (error) {
        console.error("Error al cargar salas:", error);
      }
    };
    loadRooms();
  }, []);

  // 3️⃣ Escuchar actualizaciones de salas
  useEffect(() => {
    if (!socketRef.current) return;

    const handleRoomsUpdated = (updated) => {
      console.log("🔄 Salas actualizadas desde socket:", updated);

      // Filtrar duplicados por UserID
      const uniqueRooms = updated.reduce((acc, room) => {
        const exists = acc.find(r => r.UserID === room.UserID);
        if (!exists) {
          acc.push(room);
        }
        return acc;
      }, []);

      console.log("✅ Salas únicas después de actualizar:", uniqueRooms);
      setRooms(uniqueRooms);
    };

    socketRef.current.on("roomsUpdated", handleRoomsUpdated);

    return () => {
      socketRef.current.off("roomsUpdated", handleRoomsUpdated);
    };
  }, []);

  // 4️⃣ Seleccionar sala
  const selectRoom = async (room) => {
    setSelectedRoom(room);
    setMessages([]); // Limpiar mensajes anteriores

    try {
      const msgs = await getMessages(room.RoomID);
      console.log("💬 Mensajes cargados:", msgs);
      setMessages(msgs);

      // Solo unirse si no estamos ya en la sala
      if (!joinedRooms.current.has(room.RoomID) && socketRef.current) {
        socketRef.current.emit("joinRoom", room.RoomID);
        joinedRooms.current.add(room.RoomID);
        console.log("✅ Admin unido a sala:", room.RoomID);
      }
    } catch (error) {
      console.error("Error al seleccionar sala:", error);
    }
  };

  // 5️⃣ Recibir mensajes en tiempo real
  useEffect(() => {
    if (!socketRef.current) return;

    const handleNewMessage = (msg) => {
      console.log("📩 Nuevo mensaje recibido:", msg);
      if (msg.RoomID === selectedRoom?.RoomID) {
        setMessages((prev) => {
          // Verificar duplicados por MessageID
          const exists = prev.some(m => m.MessageID === msg.MessageID);
          if (exists) {
            console.log("⚠️ Mensaje duplicado ignorado:", msg.MessageID);
            return prev;
          }
          return [...prev, msg];
        });
      }
    };

    socketRef.current.on("newMessage", handleNewMessage);

    return () => {
      socketRef.current.off("newMessage", handleNewMessage);
    };
  }, [selectedRoom]);

  // 6️⃣ Enviar mensaje
  const handleSend = async () => {
    if (!selectedRoom || !content.trim()) return;

    const messageData = {
      RoomID: selectedRoom.RoomID,
      SenderType: "admin",
      SenderID: ADMIN_ID,
      Content: content,
    };

    try {
      console.log("📤 Enviando mensaje:", messageData);
      socketRef.current.emit("sendMessage", messageData);
      setContent("");
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert("Error al enviar mensaje");
    }
  };

  return (
    <div style={{ display: "flex", height: "500px", border: "1px solid #ddd", borderRadius: "10px", overflow: "hidden" }}>
      {/* Panel de salas */}
      <div style={{
        width: "250px",
        borderRight: "1px solid #ccc",
        padding: "10px",
        overflowY: "auto",
        background: "#f9f9f9"
      }}>
        <h3 style={{ color: "#b30026", marginTop: 0 }}>Salas de Chat ({rooms.length})</h3>
        {rooms.length > 0 ? (
          rooms.map((r) => (
            <div
              key={r.RoomID} // ✅ Aseguramos que tenga key única
              onClick={() => selectRoom(r)}
              style={{
                padding: "10px",
                marginBottom: "5px",
                borderRadius: "8px",
                cursor: "pointer",
                background: selectedRoom?.RoomID === r.RoomID ? "#b30026" : "#eee",
                color: selectedRoom?.RoomID === r.RoomID ? "white" : "black",
                transition: "all 0.2s"
              }}
            >
              Usuario #{r.UserID} <small>(Sala #{r.RoomID})</small>
            </div>
          ))
        ) : (
          <p style={{ color: "gray", fontSize: "14px" }}>No hay salas activas</p>
        )}
      </div>

      {/* Área del chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "white" }}>
        <div style={{
          padding: "15px",
          borderBottom: "1px solid #ccc",
          background: "#f5f5f5",
        }}>
          <strong style={{ color: "#b30026" }}>
            {selectedRoom ? `Chat con usuario #${selectedRoom.UserID}` : "Selecciona una sala"}
          </strong>
        </div>

        {/* Mensajes */}
        <div style={{
          flex: 1,
          padding: "10px",
          overflowY: "auto",
          background: "white",
        }}>
          {messages.map((m) => (
            <div
              key={m.MessageID} // ✅ Key única
              style={{
                textAlign: m.SenderType === "admin" ? "right" : "left",
                margin: "8px 0",
              }}
            >
              <span style={{
                padding: "8px 12px",
                borderRadius: "10px",
                background: m.SenderType === "admin" ? "#ffd1dc" : "#e6e6e6",
                display: "inline-block",
                maxWidth: "70%",
                wordWrap: "break-word"
              }}>
                {m.Content}
              </span>
              <small style={{ display: "block", fontSize: "10px", color: "#999", marginTop: "2px" }}>
                {new Date(m.CreatedAt).toLocaleTimeString()}
              </small>
            </div>
          ))}
        </div>

        {selectedRoom && (
          <div style={{ display: "flex", padding: "10px", gap: "8px", borderTop: "1px solid #eee" }}>
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "5px"
              }}
              placeholder="Escribe..."
            />
            <button
              onClick={handleSend}
              style={{
                padding: "8px 15px",
                background: "#b30026",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Enviar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminChat;