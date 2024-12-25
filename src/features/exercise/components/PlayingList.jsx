import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { WarningAmber } from '@mui/icons-material'
import { Box, Grid } from '@mui/material'
import _ from 'lodash'

import CardItem from './CardItem'
import ConfirmDialog from '~/components/ConfirmDialog'

import exerciseApi from '../exerciseApi'
import customToast from '~/config/toast'

const PlayingList = ({ onEmpty = () => {} }) => {
  const navigate = useNavigate()

  const [playingDictations, setPlayingDictations] = useState(null)
  const [selectedDictation, setSelectedDictation] = useState(null)

  const handlePlay = async (id) => {
    navigate(`/exercise/play/${id}`)
  }

  const handleDelPlay = async (d) => {
    try {
      if (d.replay) {
        await exerciseApi.updateDictation(d.id, {
          replay: false
        })
        customToast.success('Hủy ôn tập thành công!')
      } else {
        await exerciseApi.delDictation(d.id)
        customToast.success('Xóa bài tập thành công!')
      }
      setPlayingDictations((prev) =>
        prev.filter((exercise) => exercise.id !== d.id)
      )
      setSelectedDictation(null)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        const playing = await exerciseApi.getUserDictations({
          playing: true
        })
        setPlayingDictations(playing)

        if (!_.isEmpty(playing))
          // Sắp xếp để các mục isCompleted: false lên đầu
          playing.sort((a, b) => a.isCompleted - b.isCompleted)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  useEffect(() => {
    if (playingDictations) onEmpty(_.isEmpty(playingDictations))
  }, [playingDictations])
  return (
    <Box py={2}>
      <Grid container spacing={3}>
        {playingDictations &&
          playingDictations.map((d) => {
            return (
              <Grid item xs={12} sm={6} md={3} key={d.id}>
                <CardItem
                  exercise={d.exerciseId}
                  play={{
                    progress:
                      (d.completedSegmentsCount * 100) /
                      d.totalCompletedSegments,
                    onPlayClick: () => handlePlay(d.id),
                    onDelClick: () => setSelectedDictation(d),
                    isCompleted: d.isCompleted,
                    replay: d.replay,
                    playing: true
                  }}
                />
              </Grid>
            )
          })}
      </Grid>
      {/* Cảnh báo trước khi xóa */}
      <ConfirmDialog
        open={!_.isEmpty(selectedDictation)}
        icon={<WarningAmber sx={{ fontSize: '48px', color: 'warning.main' }} />}
        content='Bạn có chắc chắn muốn xóa bài tập này?'
        onConfirm={() => handleDelPlay(selectedDictation)}
        onClose={() => setSelectedDictation(null)}
      />
    </Box>
  )
}

export default PlayingList
