#!/usr/bin/env python3
"""Testes unitários simples sem banco de dados."""

import unittest
import sys
import os

# Adicionar o diretório raiz ao path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from werkzeug.security import generate_password_hash, check_password_hash


class TestBasicFunctions(unittest.TestCase):
    """Testes básicos para funções sem banco."""
    
    def test_password_hashing(self):
        """Teste hash de senha."""
        password = 'testpassword123'
        hashed = generate_password_hash(password)
        
        # Verificar que não é texto plano
        self.assertNotEqual(password, hashed)
        
        # Verificar que funciona
        self.assertTrue(check_password_hash(hashed, password))
        self.assertFalse(check_password_hash(hashed, 'wrongpassword'))
    
    def test_cpf_validation(self):
        """Teste validação básica de CPF."""
        import re
        
        def validate_cpf_format(cpf):
            if not cpf:
                return False
            pattern = r'^\d{3}\.\d{3}\.\d{3}-\d{2}$'
            return bool(re.match(pattern, cpf))
        
        # CPFs válidos
        self.assertTrue(validate_cpf_format('123.456.789-00'))
        self.assertTrue(validate_cpf_format('000.000.000-00'))
        
        # CPFs inválidos
        self.assertFalse(validate_cpf_format('123456789-00'))  # Sem pontos
        self.assertFalse(validate_cpf_format('123.456.789'))   # Incompleto
        self.assertFalse(validate_cpf_format(''))             # Vazio
        self.assertFalse(validate_cpf_format('abc.def.ghi-jk')) # Não numérico
    
    def test_string_operations(self):
        """Teste operações básicas de string."""
        email = 'test@example.com'
        
        # Verificar formato básico de email
        self.assertIn('@', email)
        self.assertTrue(email.endswith('.com'))
        
        # Verificar operações de string
        name = 'João da Silva'
        self.assertEqual(name.upper(), 'JOÃO DA SILVA')
        self.assertEqual(len(name), 13)
    
    def test_uuid_generation(self):
        """Teste geração de UUID."""
        import uuid
        
        # Gerar UUIDs
        id1 = str(uuid.uuid4())
        id2 = str(uuid.uuid4())
        
        # Verificar que são diferentes
        self.assertNotEqual(id1, id2)
        
        # Verificar formato UUID
        self.assertEqual(len(id1), 36)  # UUID tem 36 caracteres
        self.assertIn('-', id1)
    
    def test_date_operations(self):
        """Teste operações com datas."""
        from datetime import datetime, date
        
        # Data atual
        today = date.today()
        now = datetime.utcnow()
        
        # Verificar tipos
        self.assertIsInstance(today, date)
        self.assertIsInstance(now, datetime)
        
        # Verificar formato de string
        date_str = '2025-12-31'
        parsed_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        self.assertEqual(parsed_date.year, 2025)
        self.assertEqual(parsed_date.month, 12)
        self.assertEqual(parsed_date.day, 31)


if __name__ == '__main__':
    print("🧪 Executando testes simples...")
    unittest.main(verbosity=2)
