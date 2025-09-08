export interface Court {
    court_id: number;
    name: string;
    code: string;
    type_id: number;
    type_name: string;
    venue_id: number;
    venue_name: string;
    hourly_rate: number;
    status: "available" | "booked" | "maintenance";
    image?: string;
    description?: string;
    is_indoor: boolean; // Thêm thuộc tính này
    surface_type?: string;
    length?: number;
    width?: number;
    created_at: string;
    updated_at?: string;
    booking_count?: number;
}

export interface BookingFormData {
    court_id: number;
    court_name?: string;
    venue_id?: number;
    venue_name?: string;
    date: string;
    start_time: string;
    end_time: string;
    duration: number;
    renter_name: string;
    renter_email: string;
    renter_phone: string;
    notes?: string;
    payment_method: string;
    total_price?: number;
}

export interface BookingSuccessData {
    booking_id: string;
    court_name: string;
    venue_name: string;
    date: string;
    start_time: string;
    end_time: string;
    renter_name: string;
    renter_email: string;
    renter_phone: string;
    payment_method: string;
    total_price: number;
}

export interface DateTimeValue {
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
}

export interface UserFormData {
    name: string;
    email: string;
    phone: string;
    notes: string;
}
