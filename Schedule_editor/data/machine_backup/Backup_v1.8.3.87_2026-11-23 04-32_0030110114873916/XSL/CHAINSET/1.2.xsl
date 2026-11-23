<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->
   <xsl:template match="chainset/desc">
      <xsl:copy>
      <xsl:choose>
       <xsl:when test="not(note)">
	  <note></note>
       </xsl:when>
       <xsl:otherwise><xsl:copy-of select="note"/></xsl:otherwise>
      </xsl:choose>

      <xsl:choose>
       <xsl:when test="not(autorun)">
          <autorun>true</autorun>
       </xsl:when>
       <xsl:otherwise><xsl:copy-of select="autorun"/></xsl:otherwise>
      </xsl:choose>

      <xsl:choose>
       <xsl:when test="not(loopto)">
          <loopto>0</loopto>
       </xsl:when>
       <xsl:otherwise><xsl:copy-of select="loopto"/></xsl:otherwise>
      </xsl:choose>

      <xsl:choose>
       <xsl:when  test="not(loopcount)">
           <loopcount>0</loopcount>
       </xsl:when>
       <xsl:otherwise><xsl:copy-of select="loopcount"/></xsl:otherwise>
      </xsl:choose>
      </xsl:copy>
    </xsl:template>

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>