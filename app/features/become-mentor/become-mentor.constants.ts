import type { BecomeMentorDocumentKey, BecomeMentorFormState } from './become-mentor.types'

export const initialBecomeMentorFormState: BecomeMentorFormState = {
  avatarUrl: '',
  avatarMediaId: null,
  fullName: '',
  gender: '',
  hometownCityId: '',
  hometown: '',
  currentCityId: '',
  currentDistrictId: '',
  currentLocation: '',
  headline: '',
  introduction: '',
  teachingStyle: '',
  experienceYears: '',
  currentPosition: '',
  workplace: '',
  education: '',
  major: '',
  meetingType: '',
  offerings: [],
  availabilities: [],
  verificationFullName: '',
  idCardNumber: '',
  documents: {
    idFront: {
      fileName: '',
      mediaId: null,
      previewUrl: ''
    },
    idBack: {
      fileName: '',
      mediaId: null,
      previewUrl: ''
    },
    selfieWithId: {
      fileName: '',
      mediaId: null,
      previewUrl: ''
    }
  }
}

export const verificationDocumentMeta: Array<{
  key: BecomeMentorDocumentKey
  label: string
  description: string
}> = [
  {
    key: 'idFront',
    label: 'Mặt trước CCCD / ID',
    description: 'Ảnh rõ nét, không lóa sáng, thấy đủ thông tin cá nhân.'
  },
  {
    key: 'idBack',
    label: 'Mặt sau CCCD / ID',
    description: 'Cần hiện đầy đủ mã QR, nơi cấp hoặc thông tin bổ sung.'
  },
  {
    key: 'selfieWithId',
    label: 'Ảnh chân dung cầm giấy tờ',
    description: 'Giúp đội ngũ kiểm tra tính xác thực trước khi duyệt.'
  }
]
