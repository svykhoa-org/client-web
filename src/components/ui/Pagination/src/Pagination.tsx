import { Pagination as AntdPagination } from 'antd';
import type { PaginationProps as AntdPaginationProps } from 'antd';
import classNames from 'classnames';

export interface PaginationProps extends AntdPaginationProps {
  className?: string;
}

const Pagination = ({ className, ...props }: PaginationProps) => {
  if (!props.total || props.total <= 0) {
    console.warn('Pagination has no total items!');
  }

  return (
    <AntdPagination
      className={classNames(
        'text-neutral-7 border-neutral-3 borderp-2 flex items-center justify-center rounded',
        className
      )}
      showQuickJumper={false}
      hideOnSinglePage={false}
      size="default"
      {...props}
    />
  );
};

export default Pagination;
