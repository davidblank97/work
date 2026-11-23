<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->
  <xsl:template match="ScheduleSelection" >
     <ScheduleSelection>
	<metadata>
		<schema_version/>
		<config_version>1.1.0</config_version>
		<author>Liburdi Automation</author>
		<date>02/08/2021</date>
	</metadata>
     <xsl:copy-of select="/ScheduleSelection/custom_name"/>
     <measurements>
       <xsl:apply-templates select="/ScheduleSelection/measurement"/>
     </measurements>

    <schedules>
     <xsl:for-each select="/ScheduleSelection/schedules/*">
       <schedule>
       <xsl:attribute name="id"></xsl:attribute> 
       <xsl:attribute name="width_min"></xsl:attribute> 
       <xsl:attribute name="width_max"></xsl:attribute> 
       </schedule>
     </xsl:for-each>
    </schedules> 

    </ScheduleSelection>
  </xsl:template>

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>