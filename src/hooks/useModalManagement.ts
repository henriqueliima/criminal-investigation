import { useCallback, useState } from 'react'

interface ClueModalState {
  isOpen: boolean
  categoryId: string | null
  content: string
}

interface CategoryModalState {
  isOpen: boolean
  categoryId: string | null
  categoryName: string
}

interface NewCategoryModalState {
  isOpen: boolean
  categoryName: string
}

export const useClueModal = () => {
  const [state, setState] = useState<ClueModalState>({
    isOpen: false,
    categoryId: null,
    content: '',
  })

  const openModal = useCallback((categoryId: string) => {
    setState({
      isOpen: true,
      categoryId,
      content: '',
    })
  }, [])

  const closeModal = useCallback(() => {
    setState({
      isOpen: false,
      categoryId: null,
      content: '',
    })
  }, [])

  const setContent = useCallback((content: string) => {
    setState((prev) => ({ ...prev, content }))
  }, [])

  return {
    ...state,
    openModal,
    closeModal,
    setContent,
  }
}

export const useCategoryModal = () => {
  const [state, setState] = useState<CategoryModalState>({
    isOpen: false,
    categoryId: null,
    categoryName: '',
  })

  const openModal = useCallback((categoryId: string, categoryName: string) => {
    setState({
      isOpen: true,
      categoryId,
      categoryName,
    })
  }, [])

  const closeModal = useCallback(() => {
    setState({
      isOpen: false,
      categoryId: null,
      categoryName: '',
    })
  }, [])

  const setCategoryName = useCallback((categoryName: string) => {
    setState((prev) => ({ ...prev, categoryName }))
  }, [])

  return {
    ...state,
    openModal,
    closeModal,
    setCategoryName,
  }
}

export const useNewCategoryModal = () => {
  const [state, setState] = useState<NewCategoryModalState>({
    isOpen: false,
    categoryName: '',
  })

  const openModal = useCallback(() => {
    setState({
      isOpen: true,
      categoryName: '',
    })
  }, [])

  const closeModal = useCallback(() => {
    setState({
      isOpen: false,
      categoryName: '',
    })
  }, [])

  const setCategoryName = useCallback((categoryName: string) => {
    setState((prev) => ({ ...prev, categoryName }))
  }, [])

  return {
    ...state,
    openModal,
    closeModal,
    setCategoryName,
  }
}
