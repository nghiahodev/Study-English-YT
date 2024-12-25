import { memo, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  Celebration,
  Done,
  Flag,
  NoteAlt,
  Replay,
  SkipNext
} from '@mui/icons-material'
import { Box, Button, FormControl, Stack, Typography } from '@mui/material'
import _ from 'lodash'

import NextForm from './NextForm'
import SeekBarDictation from './SeekBarDictation'
import Segment from './Segment'
import SegmentNote from './SegmentNote'
import SegmentNoteForm from './SegmentNoteForm'
import ConfirmDialog from '~/components/ConfirmDialog'
import TextField from '~/components/fields/TextField'

import { addLevelWords } from '../../auth/slices/levelSlice'
import exerciseApi from '../exerciseApi'
import customToast from '~/config/toast'
import statisticApi from '~/features/statistic/statisticApi'

const Dictation = ({
  exercise = {},
  dictation = {},
  onChangeDictation = () => {},
  handlePlay = () => {},
  currentTime = {},
  onSelectedSegmentIndex = () => {},
  onCheckChange = () => {}
}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [validSegmentIndexs, setValidSegmentIndexs] = useState(0)
  const [segmentIndex, setSegmentIndex] = useState(null)
  const [resultSegment, setResultSegment] = useState({})
  const [isCheck, setIsCheck] = useState(false)
  const [markers, setMarkers] = useState([])
  const [duration, setDuration] = useState(0)
  const [playTime, setPlayTime] = useState({})
  const [openSegmentNoteForm, setOpenSegmentNoteForm] = useState(false)
  const [segmentNote, setSegmentNote] = useState(null)
  const [openNextForm, setOpenNextForm] = useState(false)
  const [isExactly, setIsExactly] = useState(null)

  const segments = exercise.segments
  const { control, handleSubmit, reset } = useForm({})
  const inputRef = useRef()

  const handleNext = () => {
    getRandomSegment()
    reset({ inputWords: '' })
    setOpenNextForm(false)
  }

  const handleCheck = (newCheckValue) => {
    setIsCheck(newCheckValue)
    onCheckChange(newCheckValue) // Gọi callback khi trạng thái thay đổi
  }

  const handleChangeNote = (updateDictation) => {
    onChangeDictation(updateDictation)
  }

  const onSubmit = async (data) => {
    const id = customToast.loading()
    handleCheck(true)

    const inputWords = data.inputWords
      .replace(/[^a-zA-Z0-9 ]/g, '') // Bước 1: Loại bỏ ký tự đặc biệt
      .replace(/\s+/g, ' ') // Bước 2: Thay thế nhiều dấu cách bằng một dấu cách
      .trim()
      .toLowerCase()
      .split(' ')
      .filter((word) => word.length > 0)

    let totalCorrectedWords = 0
    const resultDictationWords = segments[segmentIndex].dictationWords.map(
      (dictationWord) => {
        const found = inputWords.includes(dictationWord)
        if (found) {
          totalCorrectedWords++
        }
        return {
          word: dictationWord,
          isCorrected: !!found
        }
      }
    )

    const resultSegment = _.cloneDeep(segments[segmentIndex])
    resultSegment.dictationWords = resultDictationWords
    setResultSegment(resultSegment)
    const isCompleted =
      totalCorrectedWords === segments[segmentIndex].dictationWords.length

    try {
      // update completed segment
      const { updateDictation, newLevelWords } =
        await exerciseApi.updateDictationSegment(
          dictation.id,
          segments[segmentIndex].id,
          { isCompleted }
        )

      onChangeDictation(updateDictation)

      // Trường hợp segment đã hoàn thành
      if (updateDictation.segments[segmentIndex]?.isCompleted) {
        //
        setIsExactly(true)

        // validSegmentIndexs chứa danh sách index hợp lệ thuộc về exercise.segments hoặc dictation.segments
        // el chính là index thuộc về segments
        setValidSegmentIndexs((prev) =>
          prev.filter((el) => el !== segmentIndex)
        )

        dispatch(addLevelWords(newLevelWords))

        // Thống kê trường hợp segment hoàn thành
        await statisticApi.updateDay({
          totalCorrectedWords,
          newLevelWordsCount: newLevelWords.length
        })

        //
        customToast.update(
          id,
          `Chúc mừng! Bạn đã trả lời chính xác!`,
          'success'
        )
      } else {
        customToast.update(id, 'Cố gắng hơn ở lần sau bạn nhé!', 'error')
        if (totalCorrectedWords > 0) {
          //
          setIsExactly(false)

          // Thống kê trường hợp không hoàn thành segment
          await statisticApi.updateDay({ totalCorrectedWords })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Ngăn hành vi mặc định (xuống dòng mới khi nhấn Enter)
      e.preventDefault()
      handleSubmit(onSubmit)()
    }
  }

  const handleLose = async () => {
    //
    setIsExactly(false)
    handleCheck(true)

    //
    customToast.error('Cố gắng hơn ở lần sau bạn nhé!')

    //
    try {
      const { updateDictation } = await exerciseApi.updateDictationSegment(
        dictation.id,
        segments[segmentIndex].id,
        { isCompleted: false }
      )
      onChangeDictation(updateDictation)
    } catch (error) {
      console.log(error)
    }
  }

  const handlePlayTime = (segmentIndex) => {
    let prev = segmentIndex === 0 ? 0 : 1
    let next = segmentIndex === segments.length - 1 ? 0 : 1
    return {
      start: segments[segmentIndex - prev].start,
      end: segments[segmentIndex + next].end
    }
  }

  // get random segment
  const getRandomSegment = () => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 0)
    // Lấy ngẫu nhiên một phần tử từ mảng validSegments
    const randomValidSegmentIndex =
      validSegmentIndexs[Math.floor(Math.random() * validSegmentIndexs.length)]

    // Tìm kiếm segment được lưu trữ trong dictation thõa mãn segment đã random
    const findSegmentNote =
      dictation.segments.find((el, index) => index === randomValidSegmentIndex)
        ?.note || null

    setSegmentNote(findSegmentNote)

    // Tìm chỉ số của phần tử này trong mảng gốc segments

    const playTime = handlePlayTime(randomValidSegmentIndex)

    console.log(playTime)
    setPlayTime(playTime)

    // Cập nhật trạng thái
    setSegmentIndex(randomValidSegmentIndex)
    handleCheck(false)
    setResultSegment(segments[randomValidSegmentIndex])
    handlePlay(playTime.start, playTime.end)
    setDuration(playTime.end - playTime.start)
    setMarkers([
      {
        value:
          segments[randomValidSegmentIndex].start -
          (randomValidSegmentIndex !== 0
            ? segments[randomValidSegmentIndex - 1].start
            : segments[randomValidSegmentIndex].start)
      },
      {
        value:
          segments[randomValidSegmentIndex].end -
          (randomValidSegmentIndex !== 0
            ? segments[randomValidSegmentIndex - 1].start
            : segments[randomValidSegmentIndex].start)
      }
    ])
  }

  const handleAfterNext = () => {
    if (isExactly) handleNext()
    else setOpenNextForm(true)
  }

  const handleFormSubmit = (e) => {
    if (isCheck) {
      e.preventDefault() // Chặn submit nếu isCheck là true
    }
  }

  const handleStart = () => {
    if (!_.isEmpty(validSegmentIndexs)) getRandomSegment()
    else customToast.info('Bài tập đã được hoàn thành!')
  }

  // effect
  useEffect(() => {
    const validSegmentIndexs = []
    dictation.segments.forEach((segment, index) => {
      // do index của của segments trong dictation và exercise là giống nhau
      if (!segment.isCompleted && segments[index].dictationWords.length > 0)
        validSegmentIndexs.push(index)
    }) // Lọc ra các segment đã hoàn thành
    // Lọc ra các phần tử có ít nhất một dictationWord với isCompleted là false
    setValidSegmentIndexs(validSegmentIndexs)
  }, [])

  useEffect(() => {
    if (segmentIndex) onSelectedSegmentIndex(segmentIndex)
  }, [segmentIndex])

  return (
    <Box sx={{ p: 2 }}>
      {segmentIndex !== null ? (
        <Box>
          <form onSubmit={handleSubmit(onSubmit)} onClick={handleFormSubmit}>
            <Box>
              {segmentIndex > 0 && (
                <Segment
                  segment={segments[segmentIndex - 1]}
                  dictationSegment={dictation.segments[segmentIndex - 1]}
                />
              )}
              <Segment
                isCurrent={true}
                segment={resultSegment}
                isDictation={true}
                isCheck={isCheck}
                dictationSegment={dictation.segments[segmentIndex]}
              />
              {segmentIndex < segments.length - 1 && (
                <Segment
                  segment={segments[segmentIndex + 1]}
                  dictationSegment={dictation.segments[segmentIndex + 1]}
                />
              )}
            </Box>
            {/* Seek bar */}
            <SeekBarDictation
              duration={duration}
              marks={markers}
              start={
                segmentIndex
                  ? segments[segmentIndex - 1].start
                  : segments[segmentIndex].start
              }
              currentTime={
                currentTime -
                (segmentIndex
                  ? segments[segmentIndex - 1].start
                  : segments[segmentIndex].start)
              }
              handlePlay={handlePlay}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                justifyItems: 'center',
                marginTop: 2
              }}
            >
              <Button
                onClick={() => {
                  handlePlay(playTime.start, playTime.end)
                }}
              >
                <Replay sx={{ color: 'warning.main' }} />
              </Button>

              <Box display='flex' alignItems='center'>
                {/* Hiển thị số thứ tự segment */}
                <Typography component='div' marginRight={2}>
                  <Typography variant='span' color='primary.main'>
                    {segmentIndex + 1}
                  </Typography>{' '}
                  / {segments.length}
                </Typography>

                {/* Nút click để đi tới segment kế tiếp */}
                <Box>
                  <Button onClick={handleAfterNext} disabled={!isCheck}>
                    <SkipNext
                      sx={{
                        color: isCheck ? 'warning.main' : 'action.disabled'
                      }}
                    />
                  </Button>
                </Box>
              </Box>
              <Button
                disabled={!isCheck}
                onClick={() => {
                  handleCheck(true)
                  setOpenSegmentNoteForm(true)
                }}
              >
                <NoteAlt
                  sx={{ color: isCheck ? 'warning.main' : 'action.disabled' }}
                />
              </Button>
              <Button disabled={isCheck} onClick={handleLose}>
                <Flag
                  sx={{
                    color: !isCheck ? 'warning.main' : 'action.disabled'
                  }}
                />
              </Button>
            </Box>
            <Stack>
              <TextField
                inputRef={inputRef}
                onKeyDown={handleKeyPress}
                name='inputWords'
                control={control}
                rules={{
                  required: 'Bạn cần nhập từ để kiểm tra câu trả lời  ' // Thông báo lỗi khi field này bị bỏ trống
                }}
                placeholder='Nhập câu trả lời của bạn ở đây!'
                autoComplete='off'
                disabled={isCheck}
                multiline
                rows={2}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '14px' // Điều chỉnh fontSize tại đây
                  }
                }}
              />

              <FormControl margin='normal'>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant='contained'
                    color='primary'
                    type='submit'
                    disabled={isCheck}
                    fullWidth
                  >
                    <Done sx={{ color: 'white' }} />
                  </Button>
                  <ConfirmDialog
                    open={dictation.isCompleted && !dictation.replay}
                    icon={
                      <Celebration
                        sx={{ fontSize: '48px', color: 'primary.main' }}
                      />
                    }
                    content={
                      <>
                        <Typography>
                          Chúc mừng ! Bạn đã hoàn thành bài tập với số điểm
                        </Typography>
                        <Typography variant='h6' color='secondary'>
                          {dictation.score || 0}
                        </Typography>
                      </>
                    }
                    onClose={() => navigate('/exercise/playlist')}
                  />
                </Box>
              </FormControl>
            </Stack>
          </form>
          {/* note */}
          {isCheck && segmentNote && <SegmentNote note={segmentNote} />}
          <SegmentNoteForm
            segmentNote={segmentNote}
            setSegmentNote={setSegmentNote}
            selectedSegment={segments[segmentIndex]}
            open={openSegmentNoteForm}
            setOpen={setOpenSegmentNoteForm}
            dictation={dictation}
            onChangeNote={handleChangeNote}
            resultSegment={resultSegment}
          />
          <NextForm
            setSegmentNote={setSegmentNote}
            selectedSegment={segments[segmentIndex]}
            open={openNextForm}
            setOpen={setOpenNextForm}
            resultSegment={resultSegment}
            onNext={handleNext}
          />
        </Box>
      ) : (
        <Box display='flex' justifyContent='center'>
          <Button
            onClick={handleStart}
            variant='contained'
            color='primary'
            type='submit'
          >
            Exercise start
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default Dictation
