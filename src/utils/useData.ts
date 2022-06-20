import { useContext } from 'react'
import { DataContext } from 'components/DataProvider'

export default () => {
  return useContext(DataContext)
}
