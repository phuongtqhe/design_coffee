import { Pagination } from 'react-bootstrap';

export default function Paginate({ currentPage, totalPages, handlePageChange }) {
  if (totalPages === 0) {
    return null;
  }

  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const onPageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      handlePageChange(page);
    }
  };

  const items = [];
  // Previous
  items.push(
    <Pagination.Prev
      key="prev"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
    />
  );
  // First page
  if (startPage > 1) {
    items.push(
      <Pagination.Item
        key={1}
        active={currentPage === 1}
        onClick={() => onPageChange(1)}
      >
        {1}
      </Pagination.Item>
    );
    if (startPage > 2) {
      items.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
    }
  }
  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    items.push(
      <Pagination.Item
        key={i}
        active={currentPage === i}
        onClick={() => onPageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }
  // Last page
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      items.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
    }
    items.push(
      <Pagination.Item
        key={totalPages}
        active={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </Pagination.Item>
    );
  }
  // Next
  items.push(
    <Pagination.Next
      key="next"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    />
  );

  return (
    <div className="d-flex justify-content-end mb-3">
      <Pagination className="mb-0">
        {items}
      </Pagination>
    </div>
  );
}