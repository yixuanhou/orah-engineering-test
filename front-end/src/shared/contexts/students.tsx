import React, { createContext, useEffect, useState } from "react"
import { LoadState, useApi } from "shared/hooks/use-api"
import { Person } from "shared/models/person"
import { RolllStateType } from "shared/models/roll"
import { ItemType } from "staff-app/components/roll-state/roll-state-list.component"

export const StudentsContext = createContext<{
  originStudentList: Person[] | undefined
  studentList: LocalStudent[] | undefined
  setStudentList: React.Dispatch<React.SetStateAction<LocalStudent[] | undefined>>
  loadState: LoadState
  rollStateFilter: ItemType | null
  setRollStateFilter: React.Dispatch<React.SetStateAction<ItemType | null>>
}>({
  originStudentList: [],
  studentList: [{ id: 1, first_name: "", last_name: "" }],
  setStudentList: () => {},
  loadState: "unloaded",
  rollStateFilter: null,
  setRollStateFilter: () => {},
})

export const StudentsProvider: React.FC = (props) => {
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })

  const [studentList, setStudentList] = useState<LocalStudent[] | undefined>()

  const [originStudentList, setOriginStudentList] = useState<Person[]>()

  const [rollStateFilter, setRollStateFilter] = useState<ItemType | null>(null)

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    setStudentList(data?.students)
    setOriginStudentList(data?.students)
  }, [data?.students])

  return (
    <StudentsContext.Provider value={{ originStudentList, studentList, setStudentList, loadState, rollStateFilter, setRollStateFilter }}>{props.children}</StudentsContext.Provider>
  )
}

export interface LocalStudent extends Person {
  rollState?: RolllStateType
}
