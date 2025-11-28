import React, { useEffect, useState, useRef } from "react";
import { createRoom, getMessages } from "../services/chat";
import { getSocket } from "../socket/socket";
import "../styles/ChatWidget.css";

function Chat({ userID }) {
  const [roomID, setRoomID] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false); // Para abrir/cerrar el widget
  const socketRef = useRef(null);
  const hasJoinedRoom = useRef(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll al final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 1️⃣ Inicializar socket UNA SOLA VEZ
  useEffect(() => {
    socketRef.current = getSocket();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off("newMessage");
      }
    };
  }, []);

  // 2️⃣ Crear/cargar sala
  useEffect(() => {
    const setupRoom = async () => {
      try {
        console.log("🏠 Configurando sala para usuario:", userID);
        const room = await createRoom(userID);
        console.log("✅ Sala obtenida:", room);
        setRoomID(room.RoomID);
        
        // Solo unirse a la sala UNA VEZ
        if (!hasJoinedRoom.current && socketRef.current) {
          socketRef.current.emit("joinRoom", room.RoomID);
          hasJoinedRoom.current = true;
          console.log("✅ Usuario unido a sala:", room.RoomID);
        }
        
        const msgs = await getMessages(room.RoomID);
        console.log("💬 Mensajes cargados:", msgs);
        setMessages(msgs);
      } catch (error) {
        console.error("❌ Error al configurar la sala:", error);
      }
    };

    if (userID) {
      setupRoom();
    }
  }, [userID]);

  // 3️⃣ Escuchar mensajes nuevos
  useEffect(() => {
    if (!socketRef.current || !roomID) return;

    const handleNewMessage = (msg) => {
      console.log("📩 Nuevo mensaje recibido:", msg);
      // Evitar duplicados verificando si el mensaje ya existe
      setMessages((prev) => {
        const exists = prev.some(m => m.MessageID === msg.MessageID);
        if (exists) {
          console.log("⚠️ Mensaje duplicado ignorado");
          return prev;
        }
        return [...prev, msg];
      });
    };

    socketRef.current.on("newMessage", handleNewMessage);

    return () => {
      socketRef.current.off("newMessage", handleNewMessage);
    };
  }, [roomID]);

  // 4️⃣ Enviar mensaje
  const handleSend = async () => {
    if (!content.trim() || !roomID) return;

    const messageData = {
      RoomID: roomID,
      SenderType: "user",
      SenderID: userID,
      Content: content,
    };

    try {
      console.log("📤 Enviando mensaje:", messageData);
      socketRef.current.emit("sendMessage", messageData);
      setContent("");
    } catch (error) {
      console.error("❌ Error al enviar mensaje:", error);
      alert("Error al enviar mensaje");
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "#b30026",
          color: "white",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          zIndex: 1000
        }}
      >
        💬
      </button>
    );
  }

  return (
    <div style={{
      width: "350px",
      height: "500px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "white",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      zIndex: 1000
    }}>
      <div style={{ 
        textAlign: "center", 
        padding: "15px", 
        background: "#b30026", 
        color: "white",
        margin: 0,
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h3 style={{ margin: 0, fontSize: "16px" }}>Chat de soporte 💬</h3>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "20px",
            cursor: "pointer",
            padding: "0 5px"
          }}
        >
          ✕
        </button>
      </div>
      
      <div style={{ 
        flex: 1, 
        padding: "10px", 
        overflowY: "auto",
        background: "#f5f5f5"
      }}>
        {messages.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999", marginTop: "20px" }}>
            ¡Hola! ¿En qué podemos ayudarte?
          </p>
        ) : (
          messages.map((m) => (
            <div
              key={m.MessageID}
              style={{
                textAlign: m.SenderType === "user" ? "right" : "left",
                margin: "8px 0",
              }}
            >
              <span style={{
                display: "inline-block",
                padding: "10px 14px",
                borderRadius: "10px",
                background: m.SenderType === "user" ? "#b30026" : "#fff",
                color: m.SenderType === "user" ? "#fff" : "#000",
                maxWidth: "70%",
                wordWrap: "break-word",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
              }}>
                {m.Content}
              </span>
              <small style={{ 
                display: "block", 
                fontSize: "10px", 
                color: "#999", 
                marginTop: "2px",
                textAlign: m.SenderType === "user" ? "right" : "left"
              }}>
                {new Date(m.CreatedAt).toLocaleTimeString()}
              </small>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div style={{ 
        padding: "10px", 
        display: "flex", 
        gap: "8px", 
        borderTop: "1px solid #eee",
        background: "white"
      }}>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          style={{ 
            flex: 1, 
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "20px",
            outline: "none"
          }}
          placeholder="Escribe un mensaje..."
        />
        <button 
          onClick={handleSend} 
          disabled={!content.trim()}
          style={{ 
            padding: "10px 20px",
            background: content.trim() ? "#b30026" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "20px",
            cursor: content.trim() ? "pointer" : "not-allowed",
            fontWeight: "bold",
            transition: "all 0.2s"
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

export default Chat;