import { Option } from 'models'
import React from 'react'
import { useAppActions } from '../state'

interface Props {
  error: Option<Error>
}

export function Error ({ error }: Props) {
  const { error: action } = useAppActions()

  if (!error.isDefined) {
    return null
  }
  return (
    <span className='toast error'>
      <strong>{error.map(({ message }) => message).get()}</strong>
      <button onClick={() => action.hide()}>Close</button>
    </span>
  )
}
