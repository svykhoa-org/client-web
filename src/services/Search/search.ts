export const search = async (query: string) => {
  const apiUrl = import.meta.env.VITE_API_CHATBOX_URL

  console.log('apiUrl:', apiUrl)
  console.log('requestBody:', { prompt: query })

  // Fallback to mock data if no API URL configured
  if (!apiUrl || apiUrl === 'https://your-chatbot-api-url.com/chat') {
    console.log('Sử dụng mock data cho tìm kiếm...')

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    return generateMockResponse(query)
  }

  const requestBody = {
    prompt: query,
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 seconds timeout

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    console.log('Response:', response)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const rawResponse = await response.text()

    return rawResponse
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Yêu cầu bị timeout (quá 30 giây)')
    }
    throw error
  }
}

// Mock response generator
const generateMockResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase()

  if (lowerQuery.includes('đau đầu') || lowerQuery.includes('dau dau')) {
    return `# Hướng dẫn chuẩn đoán: Đau đầu

## 1. Phân loại đau đầu

### Đau đầu nguyên phát:
- **Đau nửa đầu (Migraine)**: Đau nhức từng cơn, thường ở một bên đầu
- **Đau đầu căng thẳng**: Đau tức ở toàn bộ đầu như bị thắt chặt
- **Đau đầu chùm (Cluster headache)**: Đau dữ dội quanh mắt

### Đau đầu thứ phát:
- Do nhiễm trùng
- Do tăng áp lực nội sọ
- Do chấn thương

## 2. Triệu chứng cần chú ý

⚠️ **Dấu hiệu nguy hiểm cần đi khám ngay:**
- Đau đầu đột ngột, dữ dội
- Kèm sốt cao, cứng gáy
- Kèm rối loạn ý thức
- Đau đầu thay đổi đột ngột về tính chất

## 3. Phương pháp điều trị

### Điều trị không dùng thuốc:
- Nghỉ ngơi trong phòng tối, yên tĩnh
- Chườm lạnh hoặc nóng
- Massage nhẹ nhàng
- Tập thở sâu, thư giãn

### Điều trị bằng thuốc:
- Thuốc giảm đau không kê đơn (paracetamol, ibuprofen)
- Thuốc chuyên biệt cho migraine (theo chỉ định bác sĩ)

**Lưu ý:** Nếu đau đầu kéo dài hoặc có dấu hiệu bất thường, hãy thăm khám bác sĩ để được chẩn đoán và điều trị chính xác.`
  }

  if (lowerQuery.includes('ho') || lowerQuery.includes('cough')) {
    return `# Hướng dẫn chuẩn đoán: Ho

## 1. Phân loại ho

### Theo thời gian:
- **Ho cấp tính**: < 3 tuần
- **Ho bán cấp**: 3-8 tuần  
- **Ho mãn tính**: > 8 tuần

### Theo tính chất:
- **Ho khô**: Không có đờm
- **Ho có đờm**: Kèm theo bài tiết

## 2. Nguyên nhân thường gặp

### Ho cấp tính:
- Nhiễm trùng đường hô hấp trên (cảm lạnh, cúm)
- Viêm họng, viêm thanh quản
- Viêm phế quản cấp

### Ho mãn tính:
- Hen suyễn
- Bệnh phổi tắc nghẽn mãn tính (COPD)
- Trào ngược dạ dày thực quản
- Thuốc ức chế ACE

## 3. Dấu hiệu cần chú ý

🚨 **Cần khám ngay khi:**
- Ho ra máu
- Khó thở nặng
- Sốt cao kéo dài
- Sụt cân không rõ nguyên nhân
- Ho kéo dài > 2 tuần không thuyên giảm

## 4. Điều trị

### Điều trị triệu chứng:
- Uống nhiều nước ấm
- Súc họng với nước muối
- Dùng máy tạo độ ẩm
- Tránh khói thuốc và chất gây kích ứng

### Thuốc ho:
- Thuốc long đờm
- Thuốc giảm ho (theo chỉ định)
- Kháng sinh (nếu do vi khuẩn)

**Khuyến cáo:** Nếu ho không thuyên giảm sau 1-2 tuần hoặc có dấu hiệu nặng, hãy đến khám bác sĩ.`
  }

  // Default response
  return `# Kết quả tìm kiếm cho: "${query}"

## Thông tin tổng quan

Dựa trên từ khóa tìm kiếm của bạn, đây có thể là một tình trạng sức khỏe cần được đánh giá cẩn thận.

## Khuyến nghị chung

### 1. Theo dõi triệu chứng
- Ghi nhận thời gian xuất hiện
- Mức độ nghiêm trọng
- Các yếu tố có thể liên quan

### 2. Biện pháp chăm sóc ban đầu
- Nghỉ ngơi đầy đủ
- Uống đủ nước
- Duy trì chế độ ăn cân bằng
- Tránh căng thẳng

### 3. Khi nào cần khám bác sĩ
- Triệu chứng kéo dài hoặc nặng lên
- Xuất hiện triệu chứng mới
- Ảnh hưởng đến sinh hoạt hàng ngày

⚠️ **Lưu ý quan trọng:** Đây chỉ là thông tin tham khảo. Để có chẩn đoán và điều trị chính xác, bạn nên thăm khám bác sĩ chuyên khoa.

## Tài nguyên hữu ích
- Liên hệ bác sĩ gia đình
- Đường dây tư vấn sức khỏe: 19003
- Cấp cứu: 115`
}
