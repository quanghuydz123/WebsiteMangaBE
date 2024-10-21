export interface GenericResponse<T> {
    message: string;
    data: T
}

// swagger nằm trong index.ts ở route . nếu ở đây sẽ bị xóa