import Button from "@material-ui/core/Button"
import React, { useContext } from "react"
import { StudentsContext } from "shared/contexts/students"
import { useApi } from "shared/hooks/use-api"
import { BorderRadius, Spacing } from "shared/styles/styles"
import { ItemType, RollStateList } from "staff-app/components/roll-state/roll-state-list.component"
import styled from "styled-components"

export type ActiveRollAction = "filter" | "exit"
interface Props {
  isActive: boolean
  onItemClick: (action: ActiveRollAction, value?: string) => void
}

export const ActiveRollOverlay: React.FC<Props> = (props) => {
  const { isActive, onItemClick } = props

  const [saveRoll] = useApi({ url: "save-roll" })

  const { originStudentList, studentList, setStudentList, setRollStateFilter } = useContext(StudentsContext)

  const handleExit = () => {
    setStudentList(originStudentList)
    setRollStateFilter(null)
    onItemClick("exit")
  }

  const handleFilter = (type: ItemType) => {
    return setRollStateFilter(type)
  }

  const handleComplete = () => {
    const selectedStudents = studentList?.filter((s) => s.rollState !== undefined)
    const param = {
      student_roll_states: selectedStudents?.map((s) => {
        return {
          student_id: s.id,
          roll_state: s.rollState,
        }
      }),
    }
    saveRoll(param)
    handleExit()
  }

  return (
    <S.Overlay isActive={isActive}>
      <S.Content>
        <div>Class Attendance</div>
        {studentList && (
          <div>
            <RollStateList
              stateList={[
                { type: "all", count: studentList.filter((s) => s.rollState !== undefined).length },
                { type: "present", count: studentList.filter((s) => s.rollState === "present").length },
                { type: "late", count: studentList.filter((s) => s.rollState === "late").length },
                { type: "absent", count: studentList.filter((s) => s.rollState === "absent").length },
              ]}
              onItemClick={handleFilter}
            />
            <div style={{ marginTop: Spacing.u6 }}>
              <Button color="inherit" onClick={handleExit}>
                Exit
              </Button>
              <Button color="inherit" style={{ marginLeft: Spacing.u2 }} onClick={handleComplete}>
                Complete
              </Button>
            </div>
          </div>
        )}
      </S.Content>
    </S.Overlay>
  )
}

const S = {
  Overlay: styled.div<{ isActive: boolean }>`
    position: fixed;
    bottom: 0;
    left: 0;
    height: ${({ isActive }) => (isActive ? "120px" : 0)};
    width: 100%;
    background-color: rgba(34, 43, 74, 0.92);
    backdrop-filter: blur(2px);
    color: #fff;
  `,
  Content: styled.div`
    display: flex;
    justify-content: space-between;
    width: 52%;
    height: 100px;
    margin: ${Spacing.u3} auto 0;
    border: 1px solid #f5f5f536;
    border-radius: ${BorderRadius.default};
    padding: ${Spacing.u4};
  `,
}
