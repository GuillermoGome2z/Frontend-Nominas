import { describe, it, expect, vi } from 'vitest'
import { documentosService } from '../services/documentosService'

describe('documentosService', () => {
  describe('validateFileSize', () => {
    it('debería validar archivos dentro del límite', () => {
      const file = new File(['a'.repeat(1024)], 'test.pdf', { type: 'application/pdf' })
      
      const result = documentosService.validateFileSize(file)
      
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('debería rechazar archivos que exceden el límite', () => {
      // Mock VITE_UPLOAD_MAX_MB = 100
      const maxBytes = 100 * 1024 * 1024
      const file = new File(['a'.repeat(maxBytes + 1)], 'large.pdf', {
        type: 'application/pdf',
      })
      
      const result = documentosService.validateFileSize(file)
      
      expect(result.valid).toBe(false)
      expect(result.error).toContain('excede el límite')
    })
  })

  describe('upload', () => {
    it('debería lanzar error específico para 413', async () => {
      const file = new File(['test'], 'test.pdf')
      
      vi.mocked(api.post).mockRejectedValue({ status: 413, message: 'Too large' })

      await expect(
        documentosService.upload(1, file)
      ).rejects.toThrow('demasiado grande')
    })
  })
})
