#!/usr/bin/env python3
"""
Script de diagnóstico para problemas de banco de dados no Render
"""

import os
import sys
from urllib.parse import urlparse

def debug_database_config():
    """Diagnostica a configuração do banco de dados"""
    print("=== DIAGNÓSTICO DO BANCO DE DADOS ===")
    
    # Verificar variável DATABASE_URL
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        print("❌ ERRO: Variável DATABASE_URL não está definida!")
        print("\n📋 SOLUÇÕES:")
        print("1. No painel do Render, vá em Environment")
        print("2. Adicione um PostgreSQL database")
        print("3. A variável DATABASE_URL será criada automaticamente")
        return False
    
    print(f"✅ DATABASE_URL encontrada")
    
    # Analisar a URL
    try:
        parsed = urlparse(database_url)
        print(f"\n📊 DETALHES DA CONEXÃO:")
        print(f"   Esquema: {parsed.scheme}")
        print(f"   Host: {parsed.hostname}")
        print(f"   Porta: {parsed.port}")
        print(f"   Banco: {parsed.path.lstrip('/')}")
        print(f"   Usuário: {parsed.username}")
        
        # Verificar se é postgres:// e precisa ser convertido
        if parsed.scheme == 'postgres':
            print("\n⚠️  AVISO: URL usa 'postgres://' - será convertida para 'postgresql://'")
        
        # Verificar hostname suspeito
        if parsed.hostname and 'dpg-' in parsed.hostname:
            print(f"\n🔍 HOSTNAME RENDER DETECTADO: {parsed.hostname}")
            print("   Este é um hostname interno do Render para PostgreSQL")
            
            # Verificar se termina com -a (interno) vs sem sufixo (externo)
            if parsed.hostname.endswith('-a'):
                print("   ✅ Hostname interno (-a) - correto para aplicações no Render")
            else:
                print("   ⚠️  Hostname pode ser externo - verifique se está correto")
        
    except Exception as e:
        print(f"❌ ERRO ao analisar DATABASE_URL: {e}")
        return False
    
    # Testar conexão
    print(f"\n🔌 TESTANDO CONEXÃO...")
    try:
        import psycopg2
        
        # Converter postgres:// para postgresql:// se necessário
        connection_url = database_url
        if connection_url.startswith('postgres://'):
            connection_url = connection_url.replace('postgres://', 'postgresql://', 1)
        
        # Tentar conectar
        conn = psycopg2.connect(connection_url)
        cursor = conn.cursor()
        cursor.execute('SELECT version();')
        version = cursor.fetchone()
        print(f"✅ CONEXÃO ESTABELECIDA!")
        print(f"   PostgreSQL: {version[0][:50]}...")
        
        # Verificar se tabelas existem
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = cursor.fetchall()
        
        if tables:
            print(f"\n📋 TABELAS ENCONTRADAS ({len(tables)}):")
            for table in tables:
                print(f"   - {table[0]}")
        else:
            print(f"\n⚠️  NENHUMA TABELA ENCONTRADA - Execute migrations!")
        
        cursor.close()
        conn.close()
        return True
        
    except ImportError:
        print("❌ ERRO: psycopg2 não instalado")
        print("   Execute: pip install psycopg2-binary")
        return False
        
    except Exception as e:
        print(f"❌ ERRO DE CONEXÃO: {e}")
        print(f"\n🔧 POSSÍVEIS SOLUÇÕES:")
        print("1. Verificar se o banco PostgreSQL está ativo no Render")
        print("2. Verificar se o banco está na mesma região do web service")
        print("3. Recriar o banco de dados no Render")
        print("4. Verificar se há firewall bloqueando a conexão")
        return False

def check_environment():
    """Verifica outras variáveis de ambiente importantes"""
    print(f"\n🌍 OUTRAS VARIÁVEIS DE AMBIENTE:")
    
    secret_key = os.getenv('SECRET_KEY')
    if secret_key:
        print(f"✅ SECRET_KEY: {'*' * len(secret_key)}")
    else:
        print(f"⚠️  SECRET_KEY não definida - usando padrão")
    
    log_level = os.getenv('LOG_LEVEL', 'INFO')
    print(f"📊 LOG_LEVEL: {log_level}")

if __name__ == '__main__':
    print("🔍 Iniciando diagnóstico do banco de dados...\n")
    
    success = debug_database_config()
    check_environment()
    
    print(f"\n{'='*50}")
    if success:
        print("✅ DIAGNÓSTICO CONCLUÍDO - Conexão OK")
    else:
        print("❌ PROBLEMAS ENCONTRADOS - Verifique as soluções acima")
    
    sys.exit(0 if success else 1)
