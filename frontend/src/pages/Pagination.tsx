import React from "react";

// Đảm bảo bạn đã import PaginationEllipsis từ thư viện UI của mình
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
  PaginationEllipsis,
} from "@components/ui/pagination";

const AppPagination = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages } = pagination;

  // Không hiển thị component nếu chỉ có 1 trang hoặc ít hơn
  if (totalPages <= 1) {
    return null;
  }

  // Hàm xử lý khi nhấn nút "Previous"
  const handlePrevious = (e) => {
    e.preventDefault(); // Ngăn hành vi mặc định của thẻ a
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Hàm xử lý khi nhấn nút "Next"
  const handleNext = (e) => {
    e.preventDefault(); // Ngăn hành vi mặc định của thẻ a
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Hàm xử lý khi nhấn vào một trang cụ thể
  const handlePageClick = (e, page) => {
    e.preventDefault();
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  // --- Logic để tạo ra các mục phân trang (số trang và dấu '...') ---
  const generatePaginationItems = () => {
    const siblingCount = 1; // Số lượng trang hiển thị ở mỗi bên của trang hiện tại
    const pageNumbers = new Set();

    // Luôn thêm trang đầu và trang cuối
    pageNumbers.add(1);
    pageNumbers.add(totalPages);

    // Thêm các trang xung quanh trang hiện tại
    for (let i = 0; i <= siblingCount; i++) {
      if (currentPage - i > 0) pageNumbers.add(currentPage - i);
      if (currentPage + i <= totalPages) pageNumbers.add(currentPage + i);
    }

    // Sắp xếp các số trang và tạo ra mảng các mục để render
    const sortedPages = Array.from(pageNumbers).sort((a, b) => a - b);
    const items = [];
    let lastPage = 0;

    for (const page of sortedPages) {
      if (lastPage !== 0 && page - lastPage > 1) {
        // Nếu có khoảng trống giữa các số trang, thêm dấu '...'
        items.push({ type: "ellipsis", key: `ellipsis-${lastPage}` });
      }
      items.push({ type: "page", number: page, key: `page-${page}` });
      lastPage = page;
    }

    return items;
  };

  const paginationItems = generatePaginationItems();

  return (
    <Pagination className="my-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={handlePrevious}
            aria-disabled={currentPage === 1}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {/* Các số trang và dấu '...' */}
        {paginationItems.map((item) => {
          if (item.type === "ellipsis") {
            return (
              <PaginationItem key={item.key}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          return (
            <PaginationItem key={item.key}>
              <PaginationLink
                href="#"
                onClick={(e) => handlePageClick(e, item.number)}
                isActive={currentPage === item.number}
              >
                {item.number}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Nút Next */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={handleNext}
            aria-disabled={currentPage === totalPages}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default AppPagination;
