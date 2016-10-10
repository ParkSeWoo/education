//
//  ViewController.swift
//  CoreDataExam
//
//  Created by plurry on 2016. 10. 1..
//  Copyright © 2016년 plurry. All rights reserved.
//

import UIKit
import CoreData

class ViewController: UIViewController {
    
    let context = (UIApplication.shared.delegate as! AppDelegate).persistentContainer.viewContext
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        /*let test = Test(context: context)
        test.name = "고길동"
        test.address = "BUSAN"
        test.timestamp = NSDate()
        
        do{
            try context.save()
            print("SaveContact => Contact saved SUCCESSFULLY!!!")
        }catch let error as NSError  {
            print("SaveContact => managedObjectContext save function failed!!")
        }*/
        
        ////////////////////
        
        let request : NSFetchRequest<Test> = Test.fetchRequest()
        request.entity = NSEntityDescription.entity(forEntityName: "Test", in: context)
        
        let pred = NSPredicate(format: "(name = %@)", "홍길동")
        //request.predicate = pred
        
        do{
            let objects = try context.fetch(request)
            print(objects.count)
            if objects.count > 0 {
                print("FindContact => Data founded!!")
                for match in objects {
                    print(match.value(forKey:"name") as! String)
                    print(match.value(forKey:"address") as! String)
                    print(match.value(forKey:"timestamp") as! NSDate)
                }
                //let match = objects[0] as! NSManagedObject
                
            }else{
                print("FindContact => Nothing founded!!")
            }
            //            }
        }catch let error as NSError  {
            print("findContact => managedObjectContext find function failed!!")
        }
        
        //Group by, MAX 구하기
        let quantityExpression = NSExpressionDescription()
        quantityExpression.name = "max.timestamp"
        quantityExpression.expression = NSExpression(forFunction: "max:", arguments: [NSExpression(forKeyPath: "timestamp")])
        quantityExpression.expressionResultType = .dateAttributeType
        
        let request2: NSFetchRequest<NSFetchRequestResult> = Test.fetchRequest()
        request2.entity = NSEntityDescription.entity(forEntityName: "Test", in: context)
        request2.propertiesToGroupBy = ["address"]
        request2.resultType = NSFetchRequestResultType.dictionaryResultType
        request2.propertiesToFetch = [quantityExpression]
        
        do {
            let results = try context.fetch(request2)
            
            print(results.count)
            print(results)
        } catch let error as NSError {
            fatalError("Error fetching max sequence: \(error)")
        }

      }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

