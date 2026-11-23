Examples of popular XSL Transformations:

   Update text of an element
  <xsl:template match="sched/metadata/schema_version">
	<xsl:copy>
	   <xsl:value-of select="'1.0'"/>
	</xsl:copy>
  </xsl:template> 

   Rename XML tag name 
  <xsl:template match="sched/global/arc_type">
    <ARCTYPE>
      <xsl:apply-templates select="@*|node()" />
    </ARCTYPE>
  </xsl:template> 
  
   Delete XML tag and keep its content 
  <xsl:template match="sched/global/flying_start">
    <xsl:apply-templates/>
  </xsl:template> 

   Delete XML tag 
  <xsl:template match="sched/global/flying_start" /> 

   Add XML tag 
  <xsl:template match="sched/global">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
      <newTag attr="">Value</newTag>
    </xsl:copy>
  </xsl:template> 

   Delete an attribute of XML tag 
  <xsl:template match="sched/segment/@index" /> 

   Rename an attribute of XML tag  
  <xsl:template match="sched/segment/@index" >
    <xsl:attribute name="newindex">
      <xsl:value-of select="."/>
    </xsl:attribute>
  </xsl:template> 

   Add an attribute to XML tag 
  <xsl:template match="sched/segment" >
    <segment time="0">
      <xsl:apply-templates select="@*|node()"/>
    </segment>
  </xsl:template>

   Move "fault_count_threshold" tag up and place it after voltage_high tag 
  <xsl:template match="sched/limits/voltage_high">
    <xsl:copy-of select="."/><xsl:copy-of select="/sched/limits/fault_count_threshold"/>
  </xsl:template>
  <xsl:template match="sched/limits/fault_count_threshold"/> 

   Change an attribute value with condition
  <xsl:template match="sched/@head">  
    <xsl:variable name="weldheadname" select="'F-STEERING'" />
    <xsl:attribute name="head">
      <xsl:choose>
       <xsl:when test=". = $weldheadname">F</xsl:when>
       <xsl:otherwise><xsl:value-of select="." /></xsl:otherwise>
      </xsl:choose>
    </xsl:attribute>
  </xsl:template>