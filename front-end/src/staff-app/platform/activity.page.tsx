import React, { useEffect } from "react"
import styled from "styled-components"
import { FontSize, FontWeight, Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"
import { ActivityCard } from "staff-app/components/activity-card/activity-card.component"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Colors } from "shared/styles/colors"

export const ActivityPage: React.FC = () => {
  const [getActivities, data, loadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" })

  useEffect(() => {
    void getActivities()
  }, [getActivities])

  return (
    <S.Container>
      <>
        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="10x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && data?.activity.length === 0 && <S.Typography>Please complete one roll</S.Typography>}

        {loadState === "loaded" && data?.activity && (
          <S.GridContainer>
            {data.activity.map((activity, key) => {
              return (
                <S.GridItem key={key}>
                  <ActivityCard activity={activity} />
                </S.GridItem>
              )
            })}
          </S.GridContainer>
        )}
      </>
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 85%;
    margin: ${Spacing.u4} auto 0;
  `,
  GridContainer: styled.div`
    display: grid;
    grid-template-columns: auto auto;
    padding: 10px;
    gap: 20px;
  `,
  GridItem: styled.div`
    align-self: stretch;
  `,
  Typography: styled.div`
    text-align: center;
    color: ${Colors.dark.base};
    font-weight: ${FontWeight.strong};
    font-size: ${FontSize.u1};
  `,
}
