export class ChatRoom {
    public RoomID?: number;
    public UserID!: number;
    public CreatedAt?: string;

    constructor(UserID: number, RoomID?: number, CreatedAt?: string) {
        this.RoomID = RoomID;
        this.UserID = UserID;
        this.CreatedAt = CreatedAt;
    }

    static fromDB(row: any): ChatRoom {
        return new ChatRoom(
            row.UserID,
            row.RoomID,
            row.CreatedAt
        );
    }

    toJson() {
        return {
            RoomID: this.RoomID,
            UserID: this.UserID,
            CreatedAt: this.CreatedAt
        };
    }
}
