// src/types/users.ts

export type Role = "admin" | "staff" | "super_admin"

export type Users = {
  id: string
  role: Role
  email: string
  first_name: string
  last_name: string

}
