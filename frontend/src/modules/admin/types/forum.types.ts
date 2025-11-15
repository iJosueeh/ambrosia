export interface TopicDTO {
    id: string;
    title: string;
    category: string;
    author: string;
    replies: number;
    lastActivity: string; // ISO date string
    status: 'Open' | 'Closed' | 'Reported';
}

export interface PaginatedTopics {
    content: TopicDTO[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number; // current page number (0-indexed)
}
