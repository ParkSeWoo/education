//
//  MovieItem.swift
//  NaverOpenAPIExam
//
//  Created by plurry on 2016. 9. 25..
//  Copyright © 2016년 plurry. All rights reserved.
//

import Foundation
/*
 <item>
 <title>보이는 <b>영화</b></title>
 <link>
 http://openapi.naver.com/l?AAAA3ISw6DIBhF4dX8DEkF62PAQFK7Dx6XYBqqIjVh9+XkG53zh1wVrZq0oKWn9UXzSNPESj2g0n5vYB9U5TrbPwYrhbctAM8gjBy8d137Y2AxI6hYykFyIfFuLpjsIv+aG5m7Pf0B9kaFu2sAAAA=
 </link>
 <image>
 http://imgmovie.naver.com/mdi/mit110/1093/109314_P01_121817.jpg
 </image>
 <subtitle>VISIBLE CINEMA</subtitle>
 <pubDate>2013</pubDate>
 <director>장은주|</director>
 <actor/>
 <userRating>0.00</userRating>
 </item>
 */
class MovieItem {
    init() {
        
    }
    var title : String?
    var link : String?
    var image : String?
    var subtitle : String?
    var pubDate : Int?
    var director : String?
    var actor : String?
    var userRating : Float?
}
