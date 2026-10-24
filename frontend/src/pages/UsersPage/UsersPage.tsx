import { authStore } from "@/features/auth";
import { CreateEmployeeForm, usersStore, UserTable } from "@/features/users";
import { LoadState } from "@/shared/ui/LoadState";
import { observer } from "mobx-react-lite"
import { useEffect, useState } from "react";

export const UsersPage = observer(() => {
    const [showDismissed, setShowDismissed] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        usersStore.load();
    }, []);

    const roles = authStore.creatableRoles;
    const visibleUsers = showDismissed
        ? usersStore.items
        : usersStore.items.filter((user) => !user.dismissed);
    
    return (
        <>
            <h1>Сотрудники</h1>

            {roles.length > 0 &&
                (isFormOpen ? (
                    <CreateEmployeeForm
                        roles={roles}
                        onSuccess={() => setIsFormOpen(false)}
                        onCancel={() => setIsFormOpen(false)}
                    />
                ) : (
                    <button onClick={() => setIsFormOpen(true)}>Добавить сотрудника</button>
                ))
            }

            <label>
                <input 
                    type='checkbox'
                    checked={showDismissed}
                    onChange={(e) => setShowDismissed(e.target.checked)}
                />
                {' '}Показывать уволенных
            </label>

            <LoadState
                status={usersStore.status}
                error={usersStore.error}
                isEmpty={visibleUsers.length === 0}
                emptyText="Сотрудников нет"
                onRetry={() => void usersStore.load()}
            >
                <UserTable users={visibleUsers} />
            </LoadState>
        </>
    )
})