declare const resouce: {
    pageBtn: {
        total: (total: number) => string;
        first: string;
        last: string;
        prev: string;
        next: string;
    };
    noData: string;
    date: {
        showHeaderStr: (date: Date, mode: 'year' | 'month' | 'date') => string;
        months: string[];
        weekDays: string[];
    };
};
export default resouce;
