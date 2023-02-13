import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "@material-ui/core/ButtonBase"
import React, { useContext, useState } from "react"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { StudentsContext } from "shared/contexts/students"
import { PersonHelper } from "shared/models/person"
import { Colors } from "shared/styles/colors"
import { BorderRadius, FontWeight, Spacing } from "shared/styles/styles"
import { ActiveRollAction, ActiveRollOverlay } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import styled from "styled-components"

export const HomeBoardPage: React.FC = () => {
  const { studentList, loadState, rollStateFilter } = useContext(StudentsContext)

  const [isRollMode, setIsRollMode] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [sortBy, setSortBy] = useState("firstName")
  const [sortDirection, setSortDirection] = useState("ascending")

  let sortedStudents = studentList

  if (sortBy === "firstName") {
    sortedStudents = studentList?.sort((a, b) => (sortDirection === "ascending" ? a.first_name.localeCompare(b.first_name) : b.first_name.localeCompare(a.first_name)))
  }
  if (sortBy === "lastName") {
    sortedStudents = studentList?.sort((a, b) => (sortDirection === "ascending" ? a.last_name.localeCompare(b.last_name) : b.last_name.localeCompare(a.last_name)))
  }

  const processedStudents = keyword === "" ? sortedStudents : sortedStudents?.filter((s) => PersonHelper.getFullName(s).toLowerCase().indexOf(keyword.toLowerCase()) !== -1)

  const filteredStudents = rollStateFilter
    ? rollStateFilter === "all"
      ? processedStudents?.filter((s) => s.rollState !== undefined)
      : processedStudents?.filter((s) => s.rollState === rollStateFilter)
    : processedStudents

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar
          onItemClick={onToolbarAction}
          onSearch={setKeyword}
          keyword={keyword}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && filteredStudents && (
          <>
            {filteredStudents.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  onSearch: (_: string) => void
  keyword: string
  sortDirection: string
  setSortDirection: React.Dispatch<React.SetStateAction<string>>
  sortBy: string
  setSortBy: React.Dispatch<React.SetStateAction<string>>
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, onSearch, keyword, sortDirection, setSortDirection, sortBy, setSortBy } = props

  return (
    <S.ToolbarContainer>
      <S.SortContainer>
        <S.Label>Sort by:</S.Label>
        <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
        </select>
        <S.Label marginLeft>Sort descending</S.Label>
        <input type="checkbox" checked={sortDirection === "descending"} onChange={(e) => setSortDirection(e.target.checked ? "descending" : "ascending")} />
      </S.SortContainer>
      <S.SearchBar type="search" placeholder="Search..." value={keyword} onChange={(e) => onSearch(e.target.value)} />
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  SortContainer: styled.div`
    display: flex;
    align-items: center;
  `,
  Label: styled.div<{ marginLeft?: boolean }>`
    margin-right: ${Spacing.u1};
    margin-left: ${({ marginLeft }) => (marginLeft ? 7 : 0)}px;
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
  SearchBar: styled.input`
    padding: ${Spacing.u1};
    transition: width 0.4s ease-in-out;
    &:focus {
      width: 50%;
    }
    width: 40%;
  `,
}
