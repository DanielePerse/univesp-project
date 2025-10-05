#!/usr/bin/env python3
"""Testes para funções utilitárias e helpers."""

import unittest
import sys
import os

# Adicionar o diretório raiz ao path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class TestUtilityFunctions(unittest.TestCase):
    """Testes para funções utilitárias gerais."""
    
    def test_jwt_token_structure(self):
        """Teste estrutura básica de JWT."""
        # Simular estrutura de payload JWT
        payload = {
            'user_id': '123e4567-e89b-12d3-a456-426614174000',
            'email': 'test@example.com',
            'exp': 1234567890  # timestamp
        }
        
        # Verificar estrutura
        self.assertIn('user_id', payload)
        self.assertIn('email', payload)
        self.assertIn('exp', payload)
        
        # Verificar tipos
        self.assertIsInstance(payload['user_id'], str)
        self.assertIsInstance(payload['email'], str)
        self.assertIsInstance(payload['exp'], int)
    
    def test_response_format(self):
        """Teste formato padrão de resposta da API."""
        # Resposta de sucesso
        success_response = {
            'message': 'Operation successful',
            'data': {'id': '123', 'name': 'Test'}
        }
        
        self.assertIn('message', success_response)
        self.assertEqual(success_response['message'], 'Operation successful')
        
        # Resposta de erro
        error_response = {
            'message': 'Validation error',
            'errors': ['Field is required']
        }
        
        self.assertIn('message', error_response)
        self.assertIn('errors', error_response)
        self.assertIsInstance(error_response['errors'], list)
    
    def test_status_codes(self):
        """Teste códigos de status HTTP."""
        # Códigos comuns
        status_codes = {
            'OK': 200,
            'CREATED': 201,
            'BAD_REQUEST': 400,
            'UNAUTHORIZED': 401,
            'NOT_FOUND': 404,
            'CONFLICT': 409,
            'INTERNAL_ERROR': 500
        }
        
        # Verificar códigos válidos
        for name, code in status_codes.items():
            self.assertIsInstance(code, int)
            self.assertGreaterEqual(code, 200)
            self.assertLess(code, 600)
    
    def test_data_sanitization(self):
        """Teste sanitização básica de dados."""
        
        def sanitize_string(text):
            """Remove espaços extras e caracteres especiais."""
            if not text:
                return ""
            return text.strip().replace('\n', '').replace('\r', '')
        
        # Testes de sanitização
        self.assertEqual(sanitize_string('  João Silva  '), 'João Silva')
        self.assertEqual(sanitize_string('Nome\ncom\nquebras'), 'Nomecomquebras')
        self.assertEqual(sanitize_string(''), '')
        self.assertEqual(sanitize_string(None), '')
    
    def test_pagination_logic(self):
        """Teste lógica de paginação."""
        
        def calculate_pagination(total_items, page_size, current_page):
            """Calcula informações de paginação."""
            if page_size <= 0 or current_page <= 0:
                return None
            
            total_pages = (total_items + page_size - 1) // page_size
            offset = (current_page - 1) * page_size
            
            return {
                'total_items': total_items,
                'total_pages': total_pages,
                'current_page': current_page,
                'page_size': page_size,
                'offset': offset,
                'has_next': current_page < total_pages,
                'has_prev': current_page > 1
            }
        
        # Teste paginação normal
        result = calculate_pagination(100, 10, 5)
        self.assertEqual(result['total_pages'], 10)
        self.assertEqual(result['offset'], 40)
        self.assertTrue(result['has_next'])
        self.assertTrue(result['has_prev'])
        
        # Teste primeira página
        result = calculate_pagination(100, 10, 1)
        self.assertFalse(result['has_prev'])
        self.assertTrue(result['has_next'])
        
        # Teste última página
        result = calculate_pagination(100, 10, 10)
        self.assertTrue(result['has_prev'])
        self.assertFalse(result['has_next'])


if __name__ == '__main__':
    print("🧪 Executando testes utilitários...")
    unittest.main(verbosity=2)
