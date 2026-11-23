<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->
  <xsl:template match="chainset/metadata/*[last()]">
    <xsl:copy-of select="."/>
    <signature/>
  </xsl:template> 

  <xsl:template match="chainset/desc">
    <xsl:copy-of select="."/>
    <schedules>
     <xsl:for-each select="/chainset/schedule">
      <schedule>
       <xsl:attribute name="isEnabled"><xsl:value-of select="./enable"/></xsl:attribute> 
       <xsl:value-of select="./path"/>
      </schedule>
     </xsl:for-each>
    </schedules>
  </xsl:template>
  <xsl:template match="chainset/schedule" />

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>