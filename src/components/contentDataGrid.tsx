import { DataGrid, GridColDef, GridPaginationModel, type DataGridProps } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Content, ErrResponse } from "../model/model";
import { useAuthApiContext } from "../hooks/authApiContext";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { CiCircleCheck } from "react-icons/ci";
import { CiCircleRemove } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import styles from "../styles/common.module.css";

const columns: GridColDef<Content>[] = [
    { field: "id", headerName: "ID", width: 60 },
    {
        field: "title",
        headerName: "Title",
        flex: 2,
        renderCell: (v) => (
            <NavLink to={`/content/${v.row.id}`} className={styles.navLink}>
                {v.value}
            </NavLink>
        ),
    },

    {
        field: "createAt",
        headerName: "Create At",
        flex: 2,
        valueFormatter: (v) => dayjs(v * 1000).format("DD/MM/YY HH:mm"),
    },
    {
        field: "updateAt",
        headerName: "Update At",
        flex: 2,
        valueFormatter: (v) => dayjs(v * 1000).format("DD/MM/YY HH:mm"),
    },
    {
        field: "isPublished",
        headerName: "published",
        headerAlign: "center",
        align: "center",
        flex: 1,
        renderCell: (v) => (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                {v.row.isPublished ? (
                    <CiCircleCheck color="green" size={24} />
                ) : (
                    <CiCircleRemove color="red" size={24} />
                )}
            </div>
        ),
    },
    {
        field: "order",
        headerName: "Order",
        headerAlign: "center",
        align: "center",
        flex: 1,
    },
];

export default function ContentDataGrid({ ...rest }: Omit<DataGridProps, "columns">) {
    const [rows, setRows] = useState<Content[]>([]);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { api } = useAuthApiContext();

    useEffect(() => {
        fetch(paginationModel.pageSize, 0);
    }, []);

    const handlePaginationModelChange = async (model: GridPaginationModel) => {
        await fetch(model.pageSize, model.page * model.pageSize);
        setPaginationModel(model);
    };

    const attachQueryParams = (url: string, limit: number, offset: number) => {
        url += `?limit=${limit}` + `&offset=${offset}`;
        return url;
    };
    const fetch = async (limit: number, offset: number) => {
        setIsLoading(true);
        try {
            let res = await api.get<Content[]>(attachQueryParams("/api/content", limit + 1, offset));
            switch (res.status) {
                case 200:
                    if (res.data.length == limit + 1) {
                        res.data.pop();
                        setHasNextPage(true);
                    } else {
                        setHasNextPage(false);
                    }
                    setRows(res.data);
                    break;
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                let error = err as AxiosError<ErrResponse>;
                toast.error(error.response?.data.error);
            } else toast.error(`Fatal Error: ${err}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <DataGrid
                {...rest}
                initialState={{
                    sorting: {
                        sortModel: [{ field: "date", sort: "asc" }],
                    },
                }}
                rows={rows}
                columns={columns}
                rowCount={hasNextPage ? -1 : paginationModel.page * paginationModel.pageSize + rows.length}
                paginationMeta={{ hasNextPage: hasNextPage }}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationModelChange}
                pageSizeOptions={[10, 20, 50]}
                loading={isLoading}
            />
        </>
    );
}
