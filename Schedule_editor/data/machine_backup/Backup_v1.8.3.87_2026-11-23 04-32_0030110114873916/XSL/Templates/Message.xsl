<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->
  <xsl:template match="language" >
       <xsl:variable name="localeID" select="./@localeID"/>
       <xsl:variable name="fileType" select="./@fileType"/>
       <xsl:choose>
	     <!-- Add xsl:when for each localeID -->
        <xsl:when test="$localeID='en-CA'">

         <xsl:choose>
          <xsl:when test="$fileType='API'">
 	        <!-- Add transformations below for API etc-->

          </xsl:when>
          <xsl:when test="$fileType='ARC'">
          </xsl:when>
          <xsl:when test="$fileType='AXI'">
          </xsl:when>
          <xsl:when test="$fileType='CAL'">
          </xsl:when>
          <xsl:when test="$fileType='CHS'">
          </xsl:when>
          <xsl:when test="$fileType='COM'">
          </xsl:when>
          <xsl:when test="$fileType='CRI'">
          </xsl:when>
          <xsl:when test="$fileType='DAT'">
          </xsl:when>
          <xsl:when test="$fileType='DEV'">
          </xsl:when>
          <xsl:when test="$fileType='EXE'">
          </xsl:when>
          <xsl:when test="$fileType='FLO'">
          </xsl:when>
          <xsl:when test="$fileType='IOM'">
          </xsl:when>
          <xsl:when test="$fileType='MOD'">
          </xsl:when>
          <xsl:when test="$fileType='MOT'">
          </xsl:when>
          <xsl:when test="$fileType='PID'">
          </xsl:when>
          <xsl:when test="$fileType='POW'">
          </xsl:when>
          <xsl:when test="$fileType='SCC'">
          </xsl:when>
          <xsl:when test="$fileType='SCH'">
          </xsl:when>
          <xsl:when test="$fileType='SEC'">
          </xsl:when>
          <xsl:when test="$fileType='SYS'">
          </xsl:when>
          <xsl:when test="$fileType='TRC'">
          </xsl:when>
          <xsl:when test="$fileType='TTL'">
          </xsl:when>
          <xsl:when test="$fileType='UNI'">
          </xsl:when>
          <xsl:when test="$fileType='XML'">
          </xsl:when>
          <xsl:otherwise></xsl:otherwise>
         </xsl:choose>

        </xsl:when>
        <xsl:otherwise></xsl:otherwise>
       </xsl:choose>
  </xsl:template>

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>