import React from "react";
import { Button } from "@/components/ui/button";
import { FileDown, UserPlus } from "lucide-react";
import * as XLSX from "xlsx-js-style";
import { toast } from "sonner";
import { fetchApi } from "@/lib/api";
import { User } from "@/app/(admin)/dashboard/users/types/userTypes";

// Interface cho API response
interface UserApiResponse {
    user_id: number;
    username: string;
    email: string;
    fullname?: string;
    name?: string;
    role: string;
    is_verified: boolean;
    phone?: string;
    created_at: string;
    avatar?: string;
}

interface UserActionsProps {
    onAddUser: () => void;
    users?: User[];
}

// Cập nhật định nghĩa kiểu cho cell style
interface CellStyle {
    font?: {
        bold?: boolean;
        sz?: number;
        color?: { rgb: string };
        italic?: boolean;
    };
    alignment?: {
        horizontal?: "center" | "left" | "right";
        vertical?: "center" | "top" | "bottom";
    };
    fill?: {
        fgColor?: { rgb: string };
    };
    border?: {
        top?: { style: string; color: { rgb: string } };
        bottom?: { style: string; color: { rgb: string } };
        left?: { style: string; color: { rgb: string } };
        right?: { style: string; color: { rgb: string } };
    };
}

export default function UserActions({
    onAddUser,
    users = [],
}: UserActionsProps) {
    const handleExport = async () => {
        try {
            // Nếu không có dữ liệu users được truyền vào, lấy từ API
            let dataToExport = users;

            if (users.length === 0) {
                // Lấy token từ localStorage
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("Vui lòng đăng nhập để tiếp tục");
                    return;
                }

                // Fetch dữ liệu từ API
                const response = await fetchApi("/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error("Không thể tải danh sách người dùng");
                }

                const data = await response.json();
                // Chuyển đổi dữ liệu từ API sang định dạng cần thiết
                dataToExport = data.map((user: UserApiResponse) => ({
                    user_id: user.user_id,
                    username: user.username,
                    email: user.email,
                    fullname: user.fullname || user.name || user.username,
                    role: user.role,
                    status: user.is_verified ? "active" : "inactive",
                    phone: user.phone,
                    created_at: user.created_at,
                    is_verified: user.is_verified,
                }));
            }

            // Phương pháp đơn giản hơn để tạo bảng Excel với tiêu đề
            // Tạo mảng hai chiều chứa dữ liệu hoàn chỉnh kể cả tiêu đề
            const title = "DANH SÁCH NGƯỜI DÙNG HỆ THỐNG";
            const subtitle = "NHÀ THI ĐẤU TRƯỜNG ĐẠI HỌC TRÀ VINH";
            const dateTitle = `Ngày xuất: ${formatDate(
                new Date().toISOString()
            )}`;

            // Tạo mảng cho toàn bộ nội dung worksheet
            const wsData = [
                [subtitle, "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", ""],
                [title, "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", ""],
                [dateTitle, "", "", "", "", "", "", "", ""],
                ["", "", "", "", "", "", "", "", ""],
                [
                    "STT",
                    "Tên đăng nhập",
                    "Họ và tên",
                    "Email",
                    "Số điện thoại",
                    "Vai trò",
                    "Trạng thái",
                    "Đã xác thực",
                    "Ngày tạo",
                ],
            ];

            // Thêm dữ liệu người dùng
            dataToExport.forEach((user, index) => {
                wsData.push([
                    (index + 1).toString(),
                    user.username,
                    user.fullname || "",
                    user.email,
                    user.phone || "",
                    translateRole(user.role),
                    user.status === "active" ? "Đang hoạt động" : "Tạm khóa",
                    user.is_verified ? "Đã xác thực" : "Chưa xác thực",
                    formatDate(user.created_at),
                ]);
            });

            // Thêm hàng tổng số người dùng
            wsData.push(["", "", "", "", "", "", "", "", ""]);
            wsData.push([
                `Tổng số người dùng: ${dataToExport.length}`,
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
            ]);

            // Tạo worksheet từ mảng dữ liệu
            const ws = XLSX.utils.aoa_to_sheet(wsData);

            // Áp dụng style (nếu cần)
            // Định nghĩa các styles
            const titleStyle: CellStyle = {
                font: { bold: true, sz: 16 },
                alignment: { horizontal: "center", vertical: "center" },
            };

            const headerStyle: CellStyle = {
                font: { bold: true, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "4472C4" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
            };

            const dataBorderStyle: CellStyle = {
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
                alignment: { vertical: "center" },
            };

            // Style cho hàng có nền màu (mỗi 10 người dùng)
            const coloredRowStyle: CellStyle = {
                ...dataBorderStyle,
                fill: { fgColor: { rgb: "E6F0FF" } }, // Màu xanh nhạt
            };

            // Áp dụng style cho tiêu đề
            const titleCell = XLSX.utils.encode_cell({ r: 2, c: 0 });
            if (!ws[titleCell]) ws[titleCell] = {};
            ws[titleCell].s = titleStyle;

            // Áp dụng style cho subtitle
            const subtitleCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
            if (!ws[subtitleCell]) ws[subtitleCell] = {};
            ws[subtitleCell].s = titleStyle;

            // Áp dụng style cho header
            for (let i = 0; i < 9; i++) {
                const cell = XLSX.utils.encode_cell({ r: 6, c: i });
                if (!ws[cell]) ws[cell] = {};
                ws[cell].s = headerStyle;
            }

            // Áp dụng style cho tất cả các ô dữ liệu và thêm màu nền cho mỗi 10 người dùng
            dataToExport.forEach((_, rowIndex) => {
                // Hàng bắt đầu từ 7 (sau header ở hàng 6)
                const currentRow = rowIndex + 7;

                // Xác định style dựa trên nhóm 10 người dùng
                // Math.floor(rowIndex / 10) % 2 sẽ cho giá trị 0 hoặc 1 mỗi 10 dòng
                const currentStyle =
                    Math.floor(rowIndex / 10) % 2 === 0
                        ? coloredRowStyle
                        : dataBorderStyle;

                // Áp dụng style cho từng ô trong hàng
                for (let colIndex = 0; colIndex < 9; colIndex++) {
                    const cell = XLSX.utils.encode_cell({
                        r: currentRow,
                        c: colIndex,
                    });
                    if (!ws[cell]) ws[cell] = { v: "", t: "s" };
                    ws[cell].s = currentStyle;
                }
            });

            // Áp dụng style cho dòng tổng
            const totalRowIndex = dataToExport.length + 8;
            const totalStyle: CellStyle = {
                font: { bold: true, sz: 12 },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                },
                alignment: { horizontal: "left" },
                fill: { fgColor: { rgb: "DDEBF7" } }, // Màu nền xanh nhạt
            };

            // Áp dụng style cho dòng tổng
            for (let i = 0; i < 9; i++) {
                const cell = XLSX.utils.encode_cell({ r: totalRowIndex, c: i });
                if (!ws[cell]) ws[cell] = { v: "", t: "s" };
                ws[cell].s = totalStyle;
            }

            // Thiết lập độ rộng cột
            ws["!cols"] = [
                { wch: 5 }, // STT
                { wch: 15 }, // Tên đăng nhập
                { wch: 25 }, // Họ và tên
                { wch: 30 }, // Email
                { wch: 15 }, // Số điện thoại
                { wch: 15 }, // Vai trò
                { wch: 15 }, // Trạng thái
                { wch: 15 }, // Đã xác thực
                { wch: 20 }, // Ngày tạo
            ];

            // Merge cells cho tiêu đề
            ws["!merges"] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }, // Subtitle
                { s: { r: 2, c: 0 }, e: { r: 2, c: 8 } }, // Title
                { s: { r: 4, c: 0 }, e: { r: 4, c: 8 } }, // Date
                {
                    s: { r: dataToExport.length + 8, c: 0 },
                    e: { r: dataToExport.length + 8, c: 8 },
                }, // Total row
            ];

            // Tạo workbook và thêm worksheet
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Danh sách người dùng");

            // Xuất file Excel
            XLSX.writeFile(
                wb,
                `danh_sach_nguoi_dung_${formatDateFilename(new Date())}.xlsx`
            );

            toast.success("Xuất Excel thành công!");
        } catch (error) {
            console.error("Lỗi khi xuất Excel:", error);
            toast.error(
                "Không thể xuất file Excel: " +
                    (error instanceof Error
                        ? error.message
                        : "Lỗi không xác định")
            );
        }
    };

    // Hàm chuyển đổi vai trò từ tiếng Anh sang tiếng Việt
    const translateRole = (role: string): string => {
        switch (role) {
            case "admin":
                return "Quản trị viên";
            case "manager":
                return "Quản lý";
            case "customer":
                return "Khách hàng";
            default:
                return role;
        }
    };

    // Hàm định dạng ngày tháng
    const formatDate = (dateString: string): string => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Hàm định dạng ngày tháng cho tên file
    const formatDateFilename = (date: Date): string => {
        return date.toISOString().split("T")[0];
    };

    return (
        <div className="flex gap-2">
            <Button onClick={onAddUser}>
                <UserPlus className="mr-2 h-4 w-4" />
                Thêm người dùng
            </Button>
            <Button variant="outline" onClick={handleExport}>
                <FileDown className="mr-2 h-4 w-4" />
                Xuất Excel
            </Button>
        </div>
    );
}
