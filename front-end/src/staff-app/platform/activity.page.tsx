import React, { useEffect } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"
import { ActivityCard } from "staff-app/components/activity-card/activity-card.component"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

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

        {loadState === "loaded" && data?.activity && (
          <S.GridContainer>
            {data.activity.map((activity, key) => {
              return (
                <S.GridItem>
                  <ActivityCard key={key} activity={activity} />
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
}
