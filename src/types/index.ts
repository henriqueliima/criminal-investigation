export type Id = string | number

export interface InvestigationCategory {
  id: string
  title: string
}

export interface Clue {
  id: Id
  categoryId: string
  content: string
  mediaType?: 'text' | 'image' | 'video' | 'audio'
}

export interface CategoryNodeData {
  title: string
  clues: Clue[]
}

export type Column = InvestigationCategory
export type Task = Clue
