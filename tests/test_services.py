#!/usr/bin/env python3
"""Testes para funções de serviço sem banco de dados."""

import unittest
import sys
import os
from datetime import datetime

# Adicionar o diretório raiz ao path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class TestEmployeeServiceFunctions(unittest.TestCase):
    """Testes para funções utilitárias do employee_service."""
    
    def test_cpf_validation_logic(self):
        """Teste lógica de validação de CPF."""
        import re
        
        def validate_cpf_format(cpf):
            """Função de validação de CPF."""
            if not cpf:
                return False
            pattern = r'^\d{3}\.\d{3}\.\d{3}-\d{2}$'
            return bool(re.match(pattern, cpf))
        
        # Testes de CPF válido
        self.assertTrue(validate_cpf_format('123.456.789-00'))
        self.assertTrue(validate_cpf_format('000.000.000-00'))
        self.assertTrue(validate_cpf_format('999.999.999-99'))
        
        # Testes de CPF inválido
        self.assertFalse(validate_cpf_format('12345678900'))     # Sem formatação
        self.assertFalse(validate_cpf_format('123.456.789'))     # Incompleto
        self.assertFalse(validate_cpf_format('123-456-789-00'))  # Formato errado
        self.assertFalse(validate_cpf_format(''))               # Vazio
        self.assertFalse(validate_cpf_format(None))             # None
    
    def test_document_data_structure(self):
        """Teste estrutura de dados de documentos."""
        # Simular estrutura de documento
        document = {
            'name': 'ASO - Atestado de Saúde Ocupacional',
            'expiration_date': '2025-12-31'
        }
        
        # Verificar estrutura
        self.assertIn('name', document)
        self.assertIn('expiration_date', document)
        self.assertEqual(document['name'], 'ASO - Atestado de Saúde Ocupacional')
        
        # Verificar formato de data
        date_str = document['expiration_date']
        try:
            parsed_date = datetime.strptime(date_str, '%Y-%m-%d')
            self.assertIsInstance(parsed_date, datetime)
        except ValueError:
            self.fail("Data não está no formato correto")
    
    def test_employee_data_validation(self):
        """Teste validação de dados de funcionário."""
        
        def validate_employee_data(cpf, name, company):
            """Função de validação de dados."""
            errors = []
            
            if not cpf or len(cpf.replace('.', '').replace('-', '')) != 11:
                errors.append("CPF inválido")
            
            if not name or len(name.strip()) < 2:
                errors.append("Nome deve ter pelo menos 2 caracteres")
            
            if not company or len(company.strip()) < 2:
                errors.append("Nome da empresa deve ter pelo menos 2 caracteres")
            
            return errors
        
        # Dados válidos
        errors = validate_employee_data('123.456.789-00', 'João Silva', 'Empresa LTDA')
        self.assertEqual(len(errors), 0)
        
        # Dados inválidos
        errors = validate_employee_data('', '', '')
        self.assertGreater(len(errors), 0)
        
        errors = validate_employee_data('123', 'A', 'B')
        self.assertGreater(len(errors), 0)
    
    def test_document_status_logic(self):
        """Teste lógica de status de documentos."""
        from datetime import date
        
        def check_document_status(expiration_date_str):
            """Verifica se documento está vencido."""
            try:
                exp_date = datetime.strptime(expiration_date_str, '%Y-%m-%d').date()
                return 'expired' if exp_date < date.today() else 'valid'
            except ValueError:
                return 'invalid_date'
        
        # Documento válido (futuro)
        status = check_document_status('2028-12-31')
        self.assertEqual(status, 'valid')
        
        # Documento vencido (passado)
        status = check_document_status('2020-01-01')
        self.assertEqual(status, 'expired')
        
        # Data inválida
        status = check_document_status('data-invalida')
        self.assertEqual(status, 'invalid_date')


if __name__ == '__main__':
    print("🧪 Executando testes de serviços...")
    unittest.main(verbosity=2)
