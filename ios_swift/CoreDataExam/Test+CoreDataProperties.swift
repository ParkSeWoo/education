//
//  Test+CoreDataProperties.swift
//  CoreDataExam
//
//  Created by plurry on 2016. 10. 1..
//  Copyright © 2016년 plurry. All rights reserved.
//

import Foundation
import CoreData


extension Test {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<Test> {
        return NSFetchRequest<Test>(entityName: "Test");
    }

    @NSManaged public var timestamp: NSDate?
    @NSManaged public var address: String?
    @NSManaged public var name: String?
    
    
}
