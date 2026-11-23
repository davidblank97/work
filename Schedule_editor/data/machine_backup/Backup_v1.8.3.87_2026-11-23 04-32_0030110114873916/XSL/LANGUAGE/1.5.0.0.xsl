<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

	<xsl:template match="/language/text[@id='471']/@id">
		<xsl:attribute name="id">
			<xsl:value-of select="'510'"/>
		</xsl:attribute>
	</xsl:template>
	<xsl:template match="/language/text[@id='472']/@id">
		<xsl:attribute name="id">
			<xsl:value-of select="'511'"/>
		</xsl:attribute>
	</xsl:template>

	<xsl:template match="/language/text[@id='473']/@id">
		<xsl:attribute name="id">
			<xsl:value-of select="'526'"/>
		</xsl:attribute>
	</xsl:template>
	<xsl:template match="/language/text[@id='474']/@id">
		<xsl:attribute name="id">
			<xsl:value-of select="'527'"/>
		</xsl:attribute>
	</xsl:template>
	<xsl:template match="/language/text[@id='475']/@id">
		<xsl:attribute name="id">
			<xsl:value-of select="'528'"/>
		</xsl:attribute>
	</xsl:template>
	<xsl:template match="/language/text[@id='476']/@id">
		<xsl:attribute name="id">
			<xsl:value-of select="'529'"/>
		</xsl:attribute>
	</xsl:template>
	<xsl:template match="/language/text[@id='477']/@id">
		<xsl:attribute name="id">
			<xsl:value-of select="'530'"/>
		</xsl:attribute>
	</xsl:template>
	<xsl:template match="/language/text[@id='478']/@id">
		<xsl:attribute name="id">
			<xsl:value-of select="'531'"/>
		</xsl:attribute>
	</xsl:template>
	
	
	
	<xsl:template match="language[@localeID='en-CA']/text[@id='466']">
    <xsl:copy-of select="."/>
	<text id="470">
      <content>RAISE</content>
      <desc>Refers to presenting a message to the UI.</desc>
	</text>
	<text id="471">
      <content>QUESTION</content>
      <desc>A sentence worded or expressed so as to elicit information.</desc>
	</text>
	<text id="472">
      <content>CONFIRMATION</content>
      <desc>A message that is confirming something.</desc>
	</text>
	<text id="473">
      <content>NOTIFICATION</content>
      <desc>A message that notifies the user of something.</desc>
	</text>
	<text id="474">
      <content>ESTOP</content>
      <desc>Short for 'emergency stop'.</desc>
	</text>
	<text id="475">
      <content>OVERRIDE LIMIT</content>
      <desc>Refers to unselecting all items in a list.</desc>
	</text>
	<text id="476">
      <content>CRITICAL FAULT</content>
      <desc>Refers to unselecting all items in a list.</desc>
	</text>
	<text id="477">
      <content>BLOCK NONE</content>
      <desc>Refers to an alarm message that does not block any UI.</desc>
	</text>
	<text id="478">
      <content>BLOCK UI</content>
      <desc>Refers to an alarm message that block the system's UI.</desc>
	</text>
	<text id="479">
      <content>BLOCK ALL</content>
      <desc>Refers to an alarm message that block the system's UI and all connected devices.</desc>
	</text>
	<text id="480">
      <content>CRITICAL</content>
      <desc>Refers to a critical alarm message.</desc>
	</text>
	<text id="481">
      <content>LIST</content>
      <desc>A number of connected items or names grouped together.</desc>
	</text>
	<text id="482">
      <content>RELEASE NOTES</content>
      <desc>Documents released with software builds that take note of key changes made to the product since the last release.</desc>
	</text>
	<text id="483">
      <content>DOWNLOADING</content>
      <desc>Pulling data from a remote location.</desc>
	</text>
	<text id="484">
      <content>CREATING RESTORE POINT</content>
      <desc>Refers to creating a backup before installing an update.</desc>
	</text>
	<text id="485">
      <content>INSTALLING</content>
      <desc>To install or upgrade a software component on a system.</desc>
	</text>
	<text id="486">
      <content>INSTALLED UPDATE</content>
      <desc>The software build that was installed on the system.</desc>
	</text>
	<text id="487">
      <content>FAILED TO INSTALL UPDATE</content>
      <desc>An error occurred while upgrading the system's software.</desc>
	</text>
	<text id="488">
      <content>UI</content>
      <desc>An acronym for user interface. Means the graphical/ visual component of the software.</desc>
	</text>
	<text id="489">
      <content>CONTROL BOARD</content>
      <desc>Refers to the main control circuit board that runs the system's firmware.</desc>
	</text>
	<text id="490">
      <content>SERVO BOARD</content>
      <desc>Refers to the circuit board that controls the system's servo motors.</desc>
	</text>
	<text id="491">
      <content>STEPPER BOARD</content>
      <desc>Refers to the circuit board that controls the system's stepper motors.</desc>
	</text>
	<text id="492">
      <content>NO UPDATES AVAILABLE</content>
      <desc>The system could not find any update packages that were compatible.</desc>
	</text>
	<text id="493">
      <content>CHECKING FOR UPDATES</content>
      <desc>The system is looking for compatible updates.</desc>
	</text>
	<text id="494">
      <content>OTA</content>
      <desc>Acronym for Over-the-Air. Refers to software updates that are downloaded from a remote server.</desc>
	</text>
	<text id="495">
      <content>SOFTWARE BACKUP</content>
      <desc>Refers to a full backup or copy of the system's software package that can be restored to in case an upgrade goes wrong.</desc>
	</text>
	<text id="496">
      <content>BACKUP</content>
      <desc>Refers to a user prompt to initiate the process of creating a software backup.</desc>
	</text>
	<text id="497">
      <content>BACKUP TO SERVER</content>
      <desc>Perform a software backup to be sent to a remote server.</desc>
	</text>
	<text id="498">
      <content>BACKING UP TO SERVER</content>
      <desc>The software is being copied or backed up to a remote server.</desc>
	</text>
	<text id="499">
      <content>BACKUP COMPLETE</content>
      <desc>The software backup is complete.</desc>
	</text>
	<text id="500">
      <content>CREATE KEY</content>
      <desc>Refers creating a digital USB security key.</desc>
	</text>
  </xsl:template> 

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>