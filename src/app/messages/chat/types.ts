export interface Message {
    id: string;
    message: string;
    senderId: string;
    chatId: string;
    sender: {
        name: string;
        profileImage: string;
    };
    timestamp: Date;
}
