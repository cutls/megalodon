declare namespace PleromaEntity {
    type Marker = {
        home: {
            last_read_id: string;
            version: number;
            updated_at: string;
        };
        notifications: {
            last_read_id: string;
            version: number;
            updated_at: string;
        };
    };
}
