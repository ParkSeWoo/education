//
//  SQLInterface.swift
//  SQLiteExam
//
//  Created by plurry on 2016. 10. 1..
//  Copyright © 2016년 plurry. All rights reserved.
//


import Foundation

enum SQLError : Error {
    case ConnectionError
    case QueryError
    case OtherError
}

class SQLInterface : NSObject {
    var obj_db : OpaquePointer? = nil
    var stmt : OpaquePointer? = nil
    
    lazy var db_path: String = {
        return self.doc_dir.appendingPathComponent("db.sqlite").path
    }()
    
    lazy var doc_dir: URL = {
        FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
    }()
    
    lazy var db : OpaquePointer? = {
        
        if sqlite3_open(self.db_path, &(self.obj_db)) == SQLITE_OK {
            return self.obj_db!
        }
        
        return nil
    }()
        
    override init() {
        super.init()
        do {
            try prepare_database()
        } catch {
            print("Fail to init database")
            abort()
        }
    }
    
    func prepare_database() throws {
        guard db != nil else { throw SQLError.ConnectionError }
        defer { sqlite3_finalize(stmt) }
        
        let query = "CREATE TABLE IF NOT EXISTS test (id INTEGER)"
        
        if sqlite3_prepare(db, query, -1, &stmt, nil) == SQLITE_OK {
            if sqlite3_step(stmt) == SQLITE_DONE {
                return
            }
        }
        throw SQLError.ConnectionError
    }
    
    
    deinit {
        if obj_db != nil {
            sqlite3_close(obj_db)
        }
    }
    
    func insert_value(value: Int32) throws {
        guard db != nil else { throw SQLError.ConnectionError }
        defer { sqlite3_finalize(stmt) }
        let query = "INSERT INTO test (id) VALUES (?)"
        if sqlite3_prepare_v2(db, query, -1, &stmt, nil) == SQLITE_OK {
            sqlite3_bind_int(stmt, 1, value)
            if sqlite3_step(stmt) == SQLITE_DONE { return }
        }
        throw SQLError.QueryError
    }
    
    func get_values() throws -> [Int32] {
        guard db != nil else { throw SQLError.ConnectionError }
        defer { sqlite3_finalize(stmt) }
        var result = [Int32]()
        let query = "SELECT * FROM test"
        if sqlite3_prepare(db, query, -1, &stmt, nil) == SQLITE_OK {
            while sqlite3_step(stmt) == SQLITE_ROW {
                let i:Int32 = sqlite3_column_int(stmt, 0)
                result.append(i)
            }
            return result
        }
        throw SQLError.QueryError
    }
}

