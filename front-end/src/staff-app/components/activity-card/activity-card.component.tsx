import React, { useContext, useState } from "react"
import { Activity } from "shared/models/activity"
import { Colors } from "shared/styles/colors"
import { BorderRadius, FontSize, FontWeight, Spacing } from "shared/styles/styles"
import styled from "styled-components"
import IconButton from "@material-ui/core/IconButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { getBgColor } from "../roll-state/roll-state-icon.component"
import { RolllStateType } from "shared/models/roll"
import { StudentsContext } from "shared/contexts/students"
import { Person, PersonHelper } from "shared/models/person"

interface Props {
  activity: Activity
}

export const ActivityCard: React.FC<Props> = (props) => {
  const { activity } = props

  const { studentList } = useContext(StudentsContext)

  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      <div>
        <S.Container direction="row">
          <div>
            <S.Title>{activity.entity.name}</S.Title>
            <S.SubTitle>Completed at: {new Date(activity.entity.completed_at).toLocaleDateString()}</S.SubTitle>
          </div>
          <IconButton onClick={() => setIsExpanded(!isExpanded)}>
            <FontAwesomeIcon icon={isExpanded ? "chevron-up" : "chevron-down"} size="xs" />
          </IconButton>
        </S.Container>
        {isExpanded && (
          <S.Container direction="column">
            {activity.entity.student_roll_states.map((s, key) => {
              return (
                <S.Item key={key}>
                  <div style={{ width: 150 }}>{PersonHelper.getFullName(studentList?.find((stu) => stu.id === s.student_id) as Person)}</div>
                  <S.Badge rollState={s.roll_state}>{s.roll_state.charAt(0).toUpperCase() + s.roll_state.slice(1)}</S.Badge>
                </S.Item>
              )
            })}
          </S.Container>
        )}
      </div>
    </>
  )
}

const S = {
  Container: styled.div<{ direction: string }>`
    margin-top: ${Spacing.u4};
    padding: ${Spacing.u3};
    display: flex;
    flex-direction: ${({ direction }) => direction};
    border-radius: ${BorderRadius.default};
    background-color: #fff;
    box-shadow: 0 2px 7px rba(5, 66, 145, 0.13);
    transition: box-shadow 0.3s ease-in-out;
    align-items: ${({ direction }) => (direction === "row" ? "center" : "flex-start")};
    justify-content: ${({ direction }) => (direction === "row" ? "space-between" : "center")};
    &:hover {
      box-shadow: 0 2px 7px rgba(5, 66, 145, 0.26);
    }
  `,
  Item: styled.div`
    display: flex;
    margin-bottom: ${Spacing.u3};
    align-items: center;
  `,
  SubTitle: styled.div`
    flex-grow: 1;
    padding: ${Spacing.u2};
    color: ${Colors.dark.base};
    font-weight: ${FontWeight.light};
    font-size: ${FontSize.u5};
  `,
  Title: styled.div`
    flex-grow: 1;
    padding: ${Spacing.u2};
    color: ${Colors.dark.base};
    font-weight: ${FontWeight.strong};
    font-size: ${FontSize.u3};
  `,
  Badge: styled.div<{ rollState: RolllStateType }>`
    color: ${Colors.neutral.lighter};
    background-color: ${({ rollState }) => getBgColor(rollState)};
    align-items: center;
    margin-left: ${Spacing.u6};
    border-radius: ${BorderRadius.default};
    padding: ${Spacing.u2};
    width: 50px;
    text-align: center;
    font-size: ${FontSize.u5};
    font-weight: ${FontWeight.normal};
  `,
}
