import { observer } from "mobx-react-lite";
import type { Employee } from "../types";
import { ROLE_LABEL } from "@/features/auth";
import { formatDate } from "@/shared/lib/format";

interface UserTableProps {
  users: Employee[];
}

const DriverLicense = ({ employee }: { employee: Employee }) => {
    if (!employee.driverLicenseNumber) return <>-</>

    const expiresAt = employee.driverLicenseExpiresAt;
    const isExpired = expiresAt !== null && new Date(expiresAt) < new Date();

    return (
        <>
            {employee.driverLicenseNumber}
            {expiresAt && (
                <span style={{ color: isExpired ? 'crimson' : undefined }}>
                    {' '}до {formatDate(expiresAt)}{isExpired && ' (просрочены)'}
                </span>
            )}
        </>
    )
}

export const UserTable = observer(({ users }: UserTableProps) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Сотрудник</th>
                    <th>Email</th>
                    <th>Роль</th>
                    <th>Водительское удостоверение</th>
                    <th>Статус</th>
                </tr>
            </thead>
            <tbody>
                {
                    users.map((user) => (
                        <tr key={user.id} style={{ opacity: user.dismissed ? 0.5 : 1 }}>
                            <td>{user.surname} {user.name}</td>
                            <td>{user.email}</td>
                            <td>{ROLE_LABEL[user.role]}</td>
                            <td><DriverLicense employee={user} /></td>
                            <td>{user.dismissed ? 'Уволен' : 'Работает'}</td>
                        </tr>
                    ))  
                }
            </tbody>
        </table>
    )
})