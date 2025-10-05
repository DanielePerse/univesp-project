#!/usr/bin/env python3
"""Script para executar todos os testes."""

import subprocess
import sys

def run_tests():
    """Executa todos os arquivos de teste."""
    test_files = [
        'tests/test_models.py',
        'tests/test_services.py', 
        'tests/test_utils.py'
    ]
    
    print("🧪 Executando todos os testes...\n")
    
    total_passed = 0
    total_failed = 0
    
    for test_file in test_files:
        print(f"📋 Executando {test_file}...")
        result = subprocess.run([sys.executable, test_file], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ PASSOU")
            # Contar testes (buscar por "Ran X tests")
            lines = result.stdout.split('\n')
            for line in lines:
                if 'Ran' in line and 'tests' in line:
                    try:
                        num_tests = int(line.split()[1])
                        total_passed += num_tests
                    except:
                        pass
        else:
            print("❌ FALHOU")
            print(result.stdout)
            print(result.stderr)
            total_failed += 1
        
        print("-" * 50)
    
    print(f"\n🎯 Resumo Final:")
    print(f"✅ Testes passaram: {total_passed}")
    print(f"❌ Arquivos falharam: {total_failed}")
    
    if total_failed == 0:
        print("🎉 Todos os testes passaram!")
        return True
    else:
        print("⚠️  Alguns testes falharam.")
        return False

if __name__ == '__main__':
    success = run_tests()
    sys.exit(0 if success else 1)
