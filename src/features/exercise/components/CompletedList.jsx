import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Box, Grid } from '@mui/material'
import _ from 'lodash'

import CardItem from './CardItem'

import exerciseApi from '../exerciseApi'
import customToast from '~/config/toast'
import wordApi from '~/features/word/wordApi'

const CompletedList = ({ onEmpty = () => {} }) => {
  const navigate = useNavigate()

  const [completedDictations, setCompletedDictations] = useState(null)
  const [forgetWords, setForgetWords] = useState(null)
  const [forgetDictationsIndexs, setForgetDictationsIndexs] = useState(null)
  // console.log(forgetDictationsIndexs)

  const handlePlay = async (id) => {
    navigate(`/exercise/play/${id}`)
  }

  const handleReplay = async (id, dictationIndex, forgetCount) => {
    if (forgetCount > 0) {
      try {
        await exerciseApi.updateDictation(id, {
          replay: forgetDictationsIndexs[dictationIndex]
        })
        setCompletedDictations((prev) =>
          prev.map((exercise) =>
            exercise.id === id ? { ...exercise, replay: true } : exercise
          )
        )
        customToast.success('Lưu ôn tập thành công!')
      } catch (error) {
        console.log(error)
      }
    } else customToast.info('Bạn đã nhớ 100% bài tập này!')
  }

  const handleDelReplay = async (id) => {
    try {
      await exerciseApi.updateDictation(id, {
        replay: false
      })
      setCompletedDictations((prev) =>
        prev.map((exercise) =>
          exercise.id === id ? { ...exercise, replay: false } : exercise
        )
      )
      customToast.success('Hủy ôn tập thành công!')
    } catch (error) {
      console.log(error)
    }
  }

  // Nhận vào dictation và một array words, trả về array các index có từ đã quên trong words
  const handleForgetWords = (dictation, words) => {
    let forgetSegmetsIndex = []
    let segments = dictation.exerciseId.segments
    if (words) {
      let remainingForgetWords = new Set(words) // Chuyển `words` thành một `Set`
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i]
        if (remainingForgetWords.size === 0) break // Dừng khi không còn từ nào để kiểm tra

        // Kiểm tra từ trong `segment.lemmaWords` có trùng với từ trong `remainingForgetWords` không
        const matches = segment.lemmaSegmentWords.filter(
          (word) => remainingForgetWords.has(word) // Kiểm tra trong `Set`
        )

        if (matches.length > 0) {
          forgetSegmetsIndex.push(i) // Thêm index vào danh sách nếu có từ trùng
          // Loại bỏ các từ đã khớp khỏi `remainingForgetWords`
          matches.forEach((word) => remainingForgetWords.delete(word))
        }
      }
    }
    return forgetSegmetsIndex
  }

  useEffect(() => {
    ;(async () => {
      try {
        const completed = await exerciseApi.getUserDictations({
          isCompleted: true
        })
        setCompletedDictations(completed)
        if (!_.isEmpty(completed)) {
          // Lấy danh sách từ đã quên
          let words = forgetWords
          // Chỉ gọi để lấy forgetWords ở lần render đầu tiên, tức là khi nó null
          if (!words) {
            const forgetWords = await wordApi.getForgetWords()
            words = forgetWords
            setForgetWords(forgetWords)
          }

          // Array chứa các array index đã quên của danh sách dictations
          const newForgetDictationsIndexs = []

          completed.forEach((d) => {
            const newForgetDictationIndexs = handleForgetWords(d, words)
            newForgetDictationsIndexs.push(newForgetDictationIndexs)
          })
          setForgetDictationsIndexs(newForgetDictationsIndexs)
        }
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  useEffect(() => {
    if (completedDictations) onEmpty(_.isEmpty(completedDictations))
  }, [completedDictations])
  return (
    <Box py={2}>
      <Grid container spacing={3}>
        {forgetDictationsIndexs &&
          completedDictations.map((d, i) => {
            return (
              <Grid item xs={12} sm={6} md={3} key={d.id}>
                <CardItem
                  exercise={d.exerciseId}
                  play={{
                    progress:
                      ((d.totalCompletedSegments -
                        forgetDictationsIndexs[i].length) *
                        100) /
                      d.totalCompletedSegments,
                    onReplayClick: () =>
                      handleReplay(d.id, i, forgetDictationsIndexs[i].length),
                    onPlayClick: () => handlePlay(d.id),
                    onDelClick: () => handleDelReplay(d.id, d.replay),
                    isCompleted: d.isCompleted,
                    replay: d.replay,
                    score: d.score
                  }}
                />
              </Grid>
            )
          })}
      </Grid>
    </Box>
  )
}

export default CompletedList
