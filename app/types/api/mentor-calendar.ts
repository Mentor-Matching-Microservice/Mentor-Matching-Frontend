export type MentorCalendarWindowApiResponse = {
  startTime: string
  endTime: string
}

export type MentorCalendarDateApiResponse = {
  date: string
  availableWindows?: MentorCalendarWindowApiResponse[]
  windows?: MentorCalendarWindowApiResponse[]
}

export type MentorCalendarApiResponse = {
  mentorId: number
  from: string
  to: string
  dates: MentorCalendarDateApiResponse[]
}
