import { useEffect, useMemo, useState } from 'react'

import { Box, Tab, Tabs } from '@mui/material'

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

function MenuTabs({ tabItems, tab = null }) {
  // Memoize tabItems chỉ khi tabItems thay đổi
  const tabItemsMemo = useMemo(() => tabItems, [tabItems])

  // Xác định giá trị mặc định dựa trên pathname hoặc prop tab
  const currentTabIndex = tabItemsMemo.findIndex(
    (item) => location.pathname === item.pathname
  )

  const initialTabIndex = tab !== null ? tab : currentTabIndex
  const [value, setValue] = useState(
    initialTabIndex !== -1 ? initialTabIndex : 0
  )

  useEffect(() => {
    // Chỉ thiết lập giá trị khởi tạo khi component được mount
    if (currentTabIndex !== -1 && tab !== null) {
      setValue(initialTabIndex)
    }
  }, [initialTabIndex])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='navigation tabs'
          sx={{ '& .MuiTab-root': { marginRight: 2 } }}
        >
          {tabItemsMemo.map((item, index) => (
            <Tab key={index} label={item.label} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {/* Hiển thị component tương ứng với tab đã chọn */}
      {tabItemsMemo[value] && tabItemsMemo[value].component}
    </Box>
  )
}

export default MenuTabs
