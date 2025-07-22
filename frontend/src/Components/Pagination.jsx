import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Chat from "./Chat";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table'

const Pagination = () => {
      const [currentUser, setCurrentUser] = useState({});
    const [users, setUsers] = useState([]);
    const userData = JSON.parse(localStorage.getItem("sapuserData"))
    const [pageNo, setPageNo] = useState(1)
    const [limit, setLimit] = useState(5)
    const [totalPages, setTotalPages] = useState(0)
    const [pageIndex, setPageIndex] = useState(1)
    const limitOptions = [5,10,15,20]

    const fetchTeacher = async () => {
        try {
            const response = await axios.post('http://localhost:8000/fetchUsers')
            if (response.data.status == 200) {
                const user = response.data.users.find((f) => f._id == userData?._id)
                setCurrentUser(user)
            } else {
                alert("Error in register.")
            }
        } catch (error) {
            console.log(error);
            alert("Internal server error.")
        }
    }

    const fetchUsersByPagination = async () => {
        try {
            const data = {
                pageNo: pageNo,
                limit: limit
            }
            const response = await axios.post('http://localhost:8000/fetchUsersByPagination', data)
            if (response.data.status == 200) {
                setUsers(response.data.users)
                setTotalPages(response.data.pagination.totalPages)
            } else {
                alert("Error in register.")
            }
        } catch (error) {
            console.log(error);
            alert("Internal server error.")
        }
    }
    console.log(users, "users");
    console.log(pageIndex, "pageIndex");
    console.log(pageNo, "pageNo");
    console.log(limit, "limit");
    console.log(totalPages, "totalPages");


    useEffect(() => {
        fetchTeacher()

    }, [])

    useEffect(() => {
        fetchUsersByPagination()
    }, [pageNo, limit])

    const columns = React.useMemo(
        () => [
            {
                accessorKey: '',
                header: 'SR.No.',
                cell: ({ row }) => row.index + 1,
            },
            {
                accessorKey: 'fName',
                header: 'Name',
            },
            {
                accessorKey: 'email',
                header: 'Email',
            },
            {
                accessorKey: 'phone',
                header: 'Phone',
            },
            {
                accessorKey: 'role',
                header: 'Role',
            },
        ],
        []
    );

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleLimitChange = (e) => {
        console.log(e.target.value,"ccccc");
        
        setLimit(e.target.value)
    }

    return (
        <>

            <div className=" flex flex-col" style={{ height: "100vh" }}>
                <div className="flex flex-1 bg-purple-200 ">
                    <div className="w-[70%] bg-gray-100 border-r-4 p-4">
                        <h2 className="text-lg font-semibold mb-4">Pagination</h2>
                        <table className="w-full border-2 border-gray-400 ">
                            <thead>
                                {table?.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id} className="border-2 border-gray-400">
                                        {headerGroup.headers.map((header) => (
                                            <th key={header.id} className="border-2 border-gray-400 bg-purple-300 py-2 px-3">
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table?.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="border-2 border-gray-400  py-2 px-3 hover:bg-gray-300 cursor-pointer">
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="border-2 border-gray-400  py-2 px-3">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-3 flex justify-between items-center">
                            <div className="">
                                <label >Limit: </label>
                                <select name="limit" onChange={handleLimitChange} className="w-14 border-2 border-gray-300">
                                    {limitOptions?.map((l,i)=>(
                                        <option value={l}>{l}</option>
                                    ))}
                                </select>
                            </div>

                            <div className=" flex justify-end items-center gap-9">
                                <button onClick={() => setPageNo(pageNo - 1)} disabled={pageNo <= 1}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="[w-16px] h-[16px]" viewBox="0 0 320 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" /></svg>
                                </button>
                                <p className="border-2 border-gray-400 bg-purple-300 py-1 px-3">{pageNo}</p>
                                <button onClick={() => setPageNo(pageNo + 1)} disabled={pageNo >= totalPages}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="[w-16px] h-[16px]" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" /></svg>
                                </button>
                            </div>

                        </div>



                    </div>

                    <div className="w-[30%]  p-4 bg-gray-100">

                        <Chat />

                    </div>
                </div>
            </div>


        </>
    )
}

export default Pagination