export class Message {
    public MessageID?: number;
    public RoomID!: number;
    public SenderType!: "user" | "admin";
    public SenderID!: number;
    public Content!: string;
    public CreatedAt?: string;

    constructor(
        RoomID: number,
        SenderType: "user" | "admin",
        SenderID: number,
        Content: string,
        MessageID?: number,
        CreatedAt?: string
    ) {
        this.MessageID = MessageID;
        this.RoomID = RoomID;
        this.SenderType = SenderType;
        this.SenderID = SenderID;
        this.Content = Content;
        this.CreatedAt = CreatedAt;
    }

    static fromDB(row: any): Message {
        return new Message(
            row.RoomID,
            row.SenderType,
            row.SenderID,
            row.Content,
            row.MessageID,
            row.CreatedAt
        );
    }

    toJson() {
        return {
            MessageID: this.MessageID,
            RoomID: this.RoomID,
            SenderType: this.SenderType,
            SenderID: this.SenderID,
            Content: this.Content,
            CreatedAt: this.CreatedAt
        };
    }
}
