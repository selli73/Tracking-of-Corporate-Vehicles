import type { LoadStatus } from "@/shared/lib/loadStatus";
import type { CreateEmployeeDto, Employee } from "./types";
import { makeAutoObservable } from "mobx";
import { usersApi } from "./api";
import { getErrorMessage } from "@/shared/api/getErrorMessage";
import type { CreatableRole } from "../auth";

class UsersStore {
    items: Employee[] = [];
    status: LoadStatus = 'idle';
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async load() {
        this.status = 'loading';
        this.error = null;

        try {
            this.setItems(await usersApi.getAll());
        } catch(error) {
            this.setError(getErrorMessage(error));
        }
    }

    async create(role: CreatableRole, dto: CreateEmployeeDto) {
        const employee = await usersApi.create(role, dto);
        this.addItem(employee);
        return employee;
    }

    reset() {
        this.items = [];
        this.status = 'idle';
        this.error = null;
    }

    addItem(employee: Employee) {
        this.items.push(employee);
    }

    setItems(items: Employee[]) {
        this.items = items;
        this.status = 'success';
    }

    setError(message: string) {
        this.error = message;
        this.status = 'error';
    }
}

export const usersStore = new UsersStore();