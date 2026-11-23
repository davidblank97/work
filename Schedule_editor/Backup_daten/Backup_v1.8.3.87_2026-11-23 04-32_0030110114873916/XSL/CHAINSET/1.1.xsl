<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->
  <xsl:template match="BlueJayProgram" >
     <chainset>
       <metadata>
         <schema_version/>
         <config_version>1.1.0</config_version>
         <author>Liburdi Automation</author>
         <date>02/08/2021</date>
       </metadata>
       <desc>
         <xsl:copy-of select="/BlueJayProgram/desc/*"/>
         <loopto>0</loopto>
         <loopcount>0</loopcount>
       </desc>
       <xsl:copy-of select="/BlueJayProgram/schedule"/>
    </chainset>
  </xsl:template>

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>