import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Box, Stack } from '@mui/material'
import { debounce } from 'lodash'

import SearchField from '~/components/fields/SearchField'

import exerciseApi from '../exerciseApi'

const SearchExercise = ({ resultSearch, setResultSearch, setQuery }) => {
  const [searchValue, setSearchValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const { control, handleSubmit, reset } = useForm()

  const onSubmit = async (data) => {
    if (data.q !== resultSearch) {
      setResultSearch(data.q)
      setQuery((prev) => ({ ...prev, q: data.q }))
    }
  }

  const debouncedSearch = debounce((value) => {
    setSearchValue(value)
  }, 500)

  const handleSearchChange = (value) => {
    debouncedSearch(value) // Gọi debounce function
  }

  const handleClickSuggestion = (suggestion) => {
    setSearchValue(suggestion)
    setResultSearch(suggestion)
    setQuery((prev) => ({ ...prev, q: suggestion }))
  }

  const handleClickClear = () => {
    reset({ q: '' })
    setSearchValue('')
    setResultSearch('')
    setQuery((prev) => ({ ...prev, q: '' }))
  }

  useEffect(() => {
    ;(async () => {
      if (!searchValue) {
        setSuggestions([])
        return
      }
      try {
        const { exercises } = await exerciseApi.getExercises({
          limit: 5,
          q: searchValue
        })
        const searchLower = searchValue ? searchValue.toLowerCase() : '' // Chuyển searchValue thành lowercase một lần duy nhất

        // Loại bỏ các mục trùng lặp
        const suggestionSet = new Set()

        exercises.forEach((el) => {
          if (el.title?.toLowerCase().includes(searchLower))
            suggestionSet.add(el.title)
          if (el.category?.toLowerCase().includes(searchLower))
            suggestionSet.add(el.category)
          if (el.firstUserName?.toLowerCase().includes(searchLower))
            suggestionSet.add(el.firstUserName)
        })

        setSuggestions([...suggestionSet]) // Chuyển Set thành Array
      } catch (error) {
        console.log(error)
      }
    })()
  }, [searchValue])

  useEffect(() => {
    if (resultSearch !== '') {
      reset({ q: resultSearch })
      setSearchValue(resultSearch)
    }
  }, [resultSearch])

  // Cleanup debounce function to avoid memory leaks
  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction={'row'} gap={2}>
        <SearchField
          label='Bạn tìm gì...'
          name='q'
          control={control}
          autoComplete='off'
          onSubmit={handleSubmit(onSubmit)} // Truyền hàm submit vào HeaderSearch
          onChange={handleSearchChange}
          value={searchValue}
          onClickClear={handleClickClear}
          suggestions={suggestions}
          onClickSuggestion={handleClickSuggestion}
        />
      </Stack>
    </form>
  )
}

export default SearchExercise
